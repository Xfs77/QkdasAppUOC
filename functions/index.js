
const admin = require('firebase-admin');
const imageResize = require('./ImageResize/imageResize');
const agrupationsHasChildren = require('./Agrupations/agrupationsHasChildren');
const agrupationsHasItems = require('./Agrupations/agrupationsHasItems');
const agrupationsUpdatePath = require('./Agrupations/agrupationsUpdatePath');
const stripeFunctions = require('./Stripe/stripeFunctions');
const functions = require("firebase-functions");

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
admin.initializeApp(adminConfig);

exports.generateThumbImages = imageResize.generateThumbImages;

exports.agrupationHasCildrenOnCreateLevel1 = agrupationsHasChildren.agrupationHasChildrenOnCreateLevel1;
exports.agrupationHasCildrenOnCreateLevel2 = agrupationsHasChildren.agrupationHasChildrenOnCreateLevel2;
exports.agrupationHasCildrenOnCreateLevel3 = agrupationsHasChildren.agrupationHasChildrenOnCreateLevel3;

exports.agrupationHasChildrenOnDeleteLevel1 = agrupationsHasChildren.agrupationHasChildrenOnDeleteLevel1;
exports.agrupationHasChildrenOnDeleteLevel2 = agrupationsHasChildren.agrupationHasChildrenOnDeleteLevel2;
exports.agrupationHasChildrenOnDeleteLevel3 = agrupationsHasChildren.agrupationHasChildrenOnDeleteLevel3;

exports.agrupationHasItemsOnCreateLevel1 = agrupationsHasItems.agrupationHasItemsOnCreateLevel1;
exports.agrupationHasItemsOnCreateLevel2 = agrupationsHasItems.agrupationHasItemsOnCreateLevel2;
exports.agrupationHasItemsOnCreateLevel3 = agrupationsHasItems.agrupationHasItemsOnCreateLevel3;
exports.agrupationHasItemsOnCreateLevel4 = agrupationsHasItems.agrupationHasItemsOnCreateLevel4;

exports.agrupationHasItemsOnDeleteLevel1 = agrupationsHasItems.agrupationHasItemsOnDeleteLevel1;
exports.agrupationHasItemsOnDeleteLevel2 = agrupationsHasItems.agrupationHasItemsOnDeleteLevel2;
exports.agrupationHasItemsOnDeleteLevel3 = agrupationsHasItems.agrupationHasItemsOnDeleteLevel3;
exports.agrupationHasItemsOnDeleteLevel4 = agrupationsHasItems.agrupationHasItemsOnDeleteLevel4;

exports.agrupationUpdatePathLevel1 = agrupationsUpdatePath.agrupationUpdatePathLevel1;
exports.agrupationUpdatePathLevel2 = agrupationsUpdatePath.agrupationUpdatePathLevel2;
exports.agrupationUpdatePathLevel3 = agrupationsUpdatePath.agrupationUpdatePathLevel3;
exports.agrupationUpdatePathLevel4 = agrupationsUpdatePath.agrupationUpdatePathLevel4;

exports.checkout = stripeFunctions.checkout;
exports.hooks = stripeFunctions.hooks;
exports.prova = stripeFunctions.prova;
