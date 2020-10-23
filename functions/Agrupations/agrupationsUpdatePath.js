const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.agrupationUpdatePathLevel1 = functions.firestore
  .document('agrupations/{id1}').onUpdate(async (change, context) => {

    const beforeAgrDesc = change.before.data().description;
    const afterAgrDesc = change.after.data().description;
    const afterAgr = change.after.data();
    const refAgr = admin.firestore().collection('agrupations').doc(context.params.id1);
    const refCollection = refAgr.collection('agrupations');
    if (beforeAgrDesc !== afterAgrDesc) {
      updateAgr(refCollection, beforeAgrDesc, afterAgrDesc);
      updateAgrProd(refAgr, afterAgr);
      updateProd(afterAgr);
    }
  });
exports.agrupationUpdatePathLevel2 = functions.firestore
  .document('agrupations/{id1}/agrupations/{id2}').onUpdate(async (change, context) => {
    const beforeAgrDesc = change.before.data().description;
    const afterAgrDesc = change.after.data().description;
    const afterAgr = change.after.data();
    const refAgr = admin.firestore().collection('agrupations').doc(context.params.id1).collection('agrupations')
      .doc(context.params.id2);
    const refCollection = refAgr.collection('agrupations');
    if (beforeAgrDesc !== afterAgrDesc) {
      updateAgr(refCollection, beforeAgrDesc, afterAgrDesc);
      updateAgrProd(refAgr, afterAgr);
      updateProd(afterAgr);
    }
  });
exports.agrupationUpdatePathLevel3 = functions.firestore
  .document('agrupations/{id1}/agrupations/{id2}/agrupations/{id3}').onUpdate(async (change, context) => {
    const beforeAgrDesc = change.before.data().description;
    const afterAgrDesc = change.after.data().description;
    const afterAgr = change.after.data();

    const refAgr = admin.firestore().collection('agrupations').doc(context.params.id1).collection('agrupations')
      .doc(context.params.id2).collection('agrupations')
      .doc(context.params.id3);
    const refCollection = refAgr.collection('agrupations');
    if (beforeAgrDesc !== afterAgrDesc) {
      updateAgr(refCollection, beforeAgrDesc, afterAgrDesc);
      updateAgrProd(refAgr, afterAgr);
      updateProd(afterAgr);
    }
  });
exports.agrupationUpdatePathLevel4 = functions.firestore
  .document('agrupations/{id1}/agrupations/{id2}/agrupations/{id3}/agrupations/{id4}').onUpdate(async (change, context) => {
    const beforeAgrDesc = change.before.data().description;
    const afterAgrDesc = change.after.data().description;
    const afterAgr = change.after.data();

    const refAgr = admin.firestore().collection('agrupations').doc(context.params.id1).collection('agrupations')
      .doc(context.params.id2).collection('agrupations')
      .doc(context.params.id3).collection('agrupations')
      .doc(context.params.id4);
    const refCollection = refAgr.collection('agrupations');
    if (beforeAgrDesc !== afterAgrDesc) {
      updateAgr(refCollection, beforeAgrDesc, afterAgrDesc);
      updateAgrProd(refAgr, afterAgr);
      updateProd(afterAgr);
    }
  });

function updateAgr(ref, before, after) {
  const re = new RegExp(`${before}`);
  console.log(before+'d')
  console.log(after+'a')
  return ref.get().then(res => {
    if (res.docs.length > 0) {
      res.docs.forEach(async (item) => {
        const descr = item.data().pathDescription.replace(re, `${after} `);
        await item.ref.update({pathDescription: descr});
    });
  }
    return null;
  }, err => console.log(err));
}

function updateAgrProd(ref, after) {
  return ref.collection('products').where("agrupation.id", "==", after.id).get().then(res => {
    if (res.docs.length > 0) {
      res.docs.forEach(async (item) => {
        await item.ref.update({agrupation: after});
      });
    }
    return null;
  }, err => console.log(err));
}

function updateProd(after) {
  return admin.firestore().collection('products').where("agrupation.id", "==", after.id).get().then(res => {
    if (res.docs.length > 0) {
      res.docs.forEach(async (item) => {
        await item.ref.update({agrupation: after});
      });
    }
    return null;
  }, err => console.log(err));
}
