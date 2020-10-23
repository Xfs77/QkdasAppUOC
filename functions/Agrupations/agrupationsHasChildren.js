
const functions = require("firebase-functions");
const admin = require("firebase-admin");


exports.agrupationHasChildrenOnCreateLevel1 = functions.firestore
    .document('agrupations/{id1}/agrupations/{id2}').onCreate(async (change, context) => {
    const ref = admin.firestore().collection('agrupations').doc(context.params.id1);
    const docs = await ref.collection('agrupations').get();
    if (docs.size === 1) {
        return ref.update({ hasChildren: true }).then(res => {
            return console.log(`agrupations/${context.params.id1} has children`);
        }, error => {
            return console.log(error.message);
        });
    }
    return null;
});
exports.agrupationHasChildrenOnCreateLevel2 = functions.firestore
    .document('agrupations/{id1}/agrupations/{id2}/agrupations/{id3}').onCreate(async (change, context) => {
    const ref = admin.firestore().collection('agrupations/').doc(context.params.id1)
        .collection('agrupations').doc(context.params.id2);
    const docs = await ref.collection('agrupations').get();
    if (docs.size === 1) {
        return ref.update({ hasChildren: true }).then(res => {
          return console.log(`agrupations/${context.params.id1}/agrupations/${context.params.id2} has children`);
        }, error => {
          return console.log(error.message);
        });
    }
    return null;
});
exports.agrupationHasChildrenOnCreateLevel3 = functions.firestore
    .document('agrupations/{id1}/agrupations/{id2}/agrupations/{id3}/agrupations/{id4}').onCreate(async (change, context) => {
    const ref = admin.firestore().collection('agrupations/').doc(context.params.id1)
        .collection('agrupations').doc(context.params.id2)
        .collection('agrupations').doc(context.params.id3);
    const docs = await ref.collection('agrupations').get();
    if (docs.size === 1) {
      return ref.update({ hasChildren: true }).then(res => {
        return console.log(`agrupations/${context.params.id1}/agrupations/${context.params.id2}/agrupations/${context.params.id3} has children`);
        }, error => {
        return console.log(error.message);
        });
    }
    return null;
});
exports.agrupationHasChildrenOnDeleteLevel1 = functions.firestore
    .document('agrupations/{id1}/agrupations/{id2}').onDelete(async (change, context) => {
    const ref = admin.firestore().collection('agrupations').doc(context.params.id1);
    const docs = await ref.collection('agrupations').get();
    if (docs.size === 0) {
      return ref.update({ hasChildren: false }).then(res => {
        return console.log(`agrupations/${context.params.id1} has  NO children`);
        }, error => {
        return console.log(error.message);
        });
    }
    return null;
});
exports.agrupationHasChildrenOnDeleteLevel2 = functions.firestore
    .document('agrupations/{id1}/agrupations/{id2}/agrupations/{id3}').onDelete(async (change, context) => {
    const ref = admin.firestore().collection('agrupations/').doc(context.params.id1)
        .collection('agrupations').doc(context.params.id2);
    const docs = await ref.collection('agrupations').get();
    if (docs.size === 0) {
      return ref.update({ hasChildren: false }).then(res => {
        return console.log(`agrupations/${context.params.id1}/agrupations/${context.params.id2} has  NO children`);
        }, error => {
        return console.log(error.message);
        });
    }
    return null;
});
exports.agrupationHasChildrenOnDeleteLevel3 = functions.firestore
    .document('agrupations/{id1}/agrupations/{id2}/agrupations/{id3}/agrupations/{id4}').onDelete(async (change, context) => {
    const ref = admin.firestore().collection('agrupations/').doc(context.params.id1)
        .collection('agrupations').doc(context.params.id2)
        .collection('agrupations').doc(context.params.id3);
    const docs = await ref.collection('agrupations').get();
    if (docs.size === 0) {
      return ref.update({ hasChildren: false }).then(res => {
        return console.log(`agrupations/${context.params.id1}/agrupations/${context.params.id2}agrupations/${context.params.id3} has  NO children`);
        }, error => {
        return console.log(error.message);
        });
    }
    return null;
});
