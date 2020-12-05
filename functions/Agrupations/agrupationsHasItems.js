
const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.agrupationHasItemsOnCreateLevel1 = functions.firestore
  .document('agrupations/{id1}/products/{id2}').onCreate(async (change, context) => {
    const ref = admin.firestore().collection('agrupations').doc(context.params.id1);
    const docs = await ref.collection('products').get();
    if (docs.size === 1 && change.data().agrupation.id === context.params.id1) {
      return ref.update({ hasItems: true }).then(res => {
        return console.log(`agrupations/${context.params.id1} has items`);
      }, error => {
        return console.log(error.message);
      });
    }
    return null;
  });
exports.agrupationHasItemsOnCreateLevel2 = functions.firestore
  .document('agrupations/{id1}/agrupations/{id2}/products/{id3}').onCreate(async (change, context) => {
    const ref = admin.firestore().collection('agrupations/').doc(context.params.id1)
      .collection('agrupations').doc(context.params.id2);
    const docs = await ref.collection('products').get();
    if (docs.size === 1 && change.data().agrupation.id === context.params.id2) {
      return ref.update({ hasItems: true }).then(res => {
        return console.log(`agrupations/${context.params.id1}/agrupations/${context.params.id2} has items`);
      }, error => {
        return console.log(error.message);
      });
    }
    return null;
  });
exports.agrupationHasItemsOnCreateLevel3 = functions.firestore
  .document('agrupations/{id1}/agrupations/{id2}/agrupations/{id3}/products/{id4}').onCreate(async (change, context) => {
    const ref = admin.firestore().collection('agrupations/').doc(context.params.id1)
      .collection('agrupations').doc(context.params.id2)
      .collection('agrupations').doc(context.params.id3);
    const docs = await ref.collection('products').get();
    if (docs.size === 1 && change.data().agrupation.id === context.params.id3) {
      return ref.update({ hasItems: true }).then(res => {
        return console.log(`agrupations/${context.params.id1}/agrupations/${context.params.id2}/agrupations/${context.params.id3} has items`);
      }, error => {
        return console.log(error.message);
      });
    }
    return null;
  });
exports.agrupationHasItemsOnCreateLevel4 = functions.firestore
  .document('agrupations/{id1}/agrupations/{id2}/agrupations/{id3}/agrupations/{id4}/products/{id5}').onCreate(async (change, context) => {
    const ref = admin.firestore().collection('agrupations/').doc(context.params.id1)
      .collection('agrupations').doc(context.params.id2)
      .collection('agrupations').doc(context.params.id3)
      .collection('agrupations').doc(context.params.id4);
    const docs = await ref.collection('products').get();
    if (docs.size === 1 && change.data().agrupation.id === context.params.id4) {
      return ref.update({ hasItems: true }).then(res => {
        return console.log(`agrupations/${context.params.id1}/agrupations/${context.params.id2}/agrupations/${context.params.id3}/agrupations/${context.params.id4} has items`);
      }, error => {
        return console.log(error.message);
      });
    }
    return null;
  });
exports.agrupationHasItemsOnDeleteLevel1 = functions.firestore
  .document('agrupations/{id1}/products/{id2}').onDelete(async (change, context) => {
    const ref = admin.firestore().collection('agrupations').doc(context.params.id1);
    const docs = await ref.collection('products').get();
    if (docs.size === 0 && change.data().agrupation.id === context.params.id1) {
      return ref.update({ hasItems: false }).then(res => {
        return console.log(`agrupations/${context.params.id1} has  NO items`);
      }, error => {
        return console.log(error.message);
      });
    }
    return null;
  });
exports.agrupationHasItemsOnDeleteLevel2 = functions.firestore
  .document('agrupations/{id1}/agrupations/{id2}/products/{id3}').onDelete(async (change, context) => {
    const ref = admin.firestore().collection('agrupations/').doc(context.params.id1)
      .collection('agrupations').doc(context.params.id2);
    const docs = await ref.collection('products').get();
    if (docs.size === 0 && change.data().agrupation.id === context.params.id2) {
      return ref.update({ hasItems: false }).then(res => {
        return console.log(`agrupations/${context.params.id1}/agrupations/${context.params.id2} has  NO items`);
      }, error => {
        return console.log(error.message);
      });
    }
    return null;
  });
exports.agrupationHasItemsOnDeleteLevel3 = functions.firestore
  .document('agrupations/{id1}/agrupations/{id2}/agrupations/{id3}/products/{id4}').onDelete(async (change, context) => {
    const ref = admin.firestore().collection('agrupations/').doc(context.params.id1)
      .collection('agrupations').doc(context.params.id2)
      .collection('agrupations').doc(context.params.id3);
    const docs = await ref.collection('products').get();
    if (docs.size === 0 && change.data().agrupation.id === context.params.id3) {
      return ref.update({ hasItems: false }).then(res => {
        return console.log(`agrupations/${context.params.id1}/agrupations/${context.params.id2}agrupations/${context.params.id3} has  NO items`);
      }, error => {
        return console.log(error.message);
      });
    }
    return null;
  });
exports.agrupationHasItemsOnDeleteLevel4 = functions.firestore
  .document('agrupations/{id1}/agrupations/{id2}/agrupations/{id3}/agrupations/{id4}/products/{id5}').onDelete(async (change, context) => {
    const ref = admin.firestore().collection('agrupations/').doc(context.params.id1)
      .collection('agrupations').doc(context.params.id2)
      .collection('agrupations').doc(context.params.id3)
      .collection('agrupations').doc(context.params.id4);
    const docs = await ref.collection('products').get();
    if (docs.size === 0 && change.data().agrupation.id === context.params.id4) {
      return ref.update({ hasItems: false }).then(res => {
        return console.log(`agrupations/${context.params.id1}/agrupations/${context.params.id2}agrupations/${context.params.id3}/agrupations/${context.params.id4} has  NO items`);
      }, error => {
        return console.log(error.message);
      });
    }
    return null;
  });
