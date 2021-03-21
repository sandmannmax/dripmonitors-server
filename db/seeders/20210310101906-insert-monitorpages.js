'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Monitorpages', [
      {
        id: 'cfd84fbd-e7ab-457c-896d-2e909f0173b5',
        name: 'Supreme EU',
        cc: 'DE',
        functionName: 'supreme-eu-monitor',
        visible: true,
        running: false,
        interval: 0,
        isHtml: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'ebf7bdbc-1891-424d-ba95-6ab515b23b36',
        name: 'Zalando DE',
        cc: 'DE',
        functionName: 'zalando-de-monitor',
        visible: true,
        running: false,
        interval: 0,
        isHtml: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '064900de-3c6f-4ff1-b6cd-741593c66d15',
        name: 'Afew',
        cc: 'DE',
        functionName: 'afew-monitor',
        visible: true,
        running: false,
        interval: 0,
        isHtml: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '693f725a-cf4a-4d4c-9592-a1b7e4a24671',
        name: 'Footlocker DE',
        cc: 'DE',
        functionName: 'footlocker-de-monitor',
        visible: false,
        running: false,
        interval: 0,
        isHtml: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'ff075956-e689-4c6e-aa23-118daa825b57',
        name: 'Nike SNKRS DE',
        cc: 'DE',
        functionName: 'nike-de-monitor',
        visible: true,
        running: false,
        interval: 0,
        isHtml: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Monitorpages', null, {});
  }
};