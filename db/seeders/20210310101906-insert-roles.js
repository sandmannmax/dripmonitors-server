'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Roles', [
      {
        id: '766277a1-2b6c-495b-9926-0577afb16014',
        name: 'role',
        roleId: '816014321120182382',
        monitorId: '8607078c-1fc4-477c-924e-0f2165db9c3a',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'bb0e2cf7-bfa9-48a7-a610-4dcef8c05a0b',
        name: 'role',
        roleId: '818093373167501323',
        monitorId: 'cd918cf4-93f3-4d36-aab8-403ff3ab7afc',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '16e02eb6-9d24-43ac-a766-77ac25851e76',
        name: 'role',
        roleId: '813831306815078440',
        monitorId: '6b8afb25-8387-47af-8cb3-e8b9d50a33a8',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3d6ed7a7-da27-4e7d-b2f6-e00b9d57e1d3',
        name: 'role',
        roleId: '818093373167501323',
        monitorId: 'e00d19a0-d8c5-45ce-8c88-284f5a7a3a24',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'e277422a-e49f-43cd-88b4-75121f55f9d3',
        name: 'role',
        roleId: '818093373167501323',
        monitorId: '4d555681-708f-49fd-a4be-c34c6f736488',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'ddbcde1a-77ce-46c3-a5f2-6b82571afa4c',
        name: 'role',
        roleId: '813831380382253126',
        monitorId: '53d1f142-c5b0-43d4-8a85-c631defd87c4',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '67e5802a-21c7-4bb5-8c5f-fd8d9d18d71d',
        name: 'role',
        roleId: '818093373167501323',
        monitorId: 'c2f3aea9-08e5-4908-aee2-5b5efb87bc72',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'e04a1e86-8e4d-4412-9291-4ec1cdffb4a5',
        name: 'role',
        roleId: '815931417447890975',
        monitorId: '269a8317-ec72-4f1c-93f9-73e633bdaa73',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '270edcab-806f-4e56-968c-c2e4acaf5522',
        name: 'role',
        roleId: '813831441318019112',
        monitorId: 'c685ca1e-f9aa-42e3-acd7-f678f3e27552',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};