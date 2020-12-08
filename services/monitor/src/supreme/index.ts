import fetch from 'node-fetch';
import JsSoup from 'jssoup';
import { Item } from '../types/item';
import { createNodeRedisClient } from 'handy-redis';

const client = createNodeRedisClient({ host: 'redis' });

export async function RunMonitor() {
  if (await GetRunningState())
    return;

  await SetRunningState(true);

  let items = await GetItems();

  for (let i = 0; i < items.length; i++) {
    let item = await GetItem(items[i]._id);

    if (item == null) {
      items[i].name = await GetName(items[i].href);
      await AddItem(items[i]._id, items[i].toValues());
    } else {
      let oldSoldOutState = item.soldOut == 'true';
      if (oldSoldOutState != items[i].soldOut) {
        if (!items[i].soldOut && await IsMonitoredItem(items[i]._id))
          console.log('NOTIFY MONITOR') // TODO Benachrichtigung implementieren

        await ChangeSoldOutState(items[i]._id, items[i].soldOut);
      }
    }
  }

  await SetRunningState(false);
}

async function GetItems() {
  let response = await fetch('https://www.supremenewyork.com/shop/all');
  let html = await response.text();
  let soup = new JsSoup(html);
  let articles = soup.findAll('article');
  let items: Array<Item> = []
  for (let i = 0; i < articles.length; i++) {
    let item = new Item();
    let href = articles[i].find('a').attrs.href;
    item.href = href;
    let parts = href.split('/');
    item._id = parts[parts.length - 2] + parts[parts.length - 1];
    item.active = true;
    item.soldOut = articles[i].text.toLowerCase() === 'sold out'
    items.push(item);
  }
  return items;
}

async function GetName(href) {
  await Sleep(5000);
  let result = await fetch('https://www.supremenewyork.com' + href);
  let data = await result.text();
  let soup = new JsSoup(data);
  let elem = soup.findAll('h1');
  let name = '';
  for (let i = 0; i < elem.length; i++) {
    if (elem[i].attrs.class == 'protect')
      name += elem[i].text + ' - ';
  }
  elem = soup.findAll('p');
  for (let i = 0; i < elem.length; i++) {
    if (elem[i].attrs.class.includes('protect'))
      name += elem[i].text;
  }
  return name;
}

async function GetRunningState() {
  return await client.get('stores:supreme:running') == 'true'; 
}

async function SetRunningState(value) {
  await client.set('stores:supreme:running', value);
}

async function GetItemKeys() {
  return await client.smembers('stores:supreme:products');
}

async function GetItem(key) {
  return await client.hgetall('stores:supreme:products:' + key);
}

async function AddItem(key, values) {
  await client.sadd('stores:supreme:products', key);
  await client.hset('stores:supreme:products:' + key, values);
}

async function ChangeSoldOutState(key, value) {
  await client.hset('stores:supreme:products:' + key, [ 'soldOut', value ]);
}

async function GetMonitoredItemKeys() {
  return await client.smembers('stores:supreme:monitor:products');
}

async function IsMonitoredItem(key) {
  return await client.sismember('stores:supreme:monitor:products', key) == 1;
}

async function Sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   