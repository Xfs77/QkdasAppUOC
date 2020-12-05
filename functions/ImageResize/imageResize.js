
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

const sharp = require('sharp');

const THUMB_PREFIX = 'thumb_';
const ORIGINAL_IMAGE = `original`;
const API_AGRUP = 'agrupations';
const  API_PRODUCT = 'products';
const  API_IMAGES = 'images';
const imageSizes =
  {
    168: 'imgSM',
    288: 'imgM',
    576: 'imgL',
    896: 'imgXL'
  };

exports.generateThumbImages = functions.storage.object().onFinalize(async (object) => {


  const temp = object.name.split('/');
  const reference = temp[0];
  const imageId = temp[1];

  const filePath = object.name;
  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);

  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);

  if (!fileName.startsWith(ORIGINAL_IMAGE)) {
    return false;
  }

  const bucket = admin.storage().bucket((object.bucket));
  const file = bucket.file(filePath);

  // Create the temp directory where the storage file will be downloaded.
  await fs.mkdirp(tempLocalDir);
  // Download file from bucket.
  await file.download({
    destination: tempLocalFile
  });

  await compress(896, fileDir, fileName, tempLocalFile, bucket);
  await compress(576, fileDir, fileName, tempLocalFile, bucket);
  await compress(288, fileDir, fileName, tempLocalFile, bucket);
  await compress(168, fileDir, fileName, tempLocalFile, bucket);

  fs.unlinkSync(tempLocalFile);

  // Remove original image
  await file.delete();

  return console.log('Thumbnail URLs saved to database.');

  async function compress(size, fileDir, fileName, tempLocalFile, bucket) {
    const thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_PREFIX}${size}.jpeg`));
    const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);
    // Generate thumbs with Sharp
    await sharp(tempLocalFile)
      .resize(size)
      .withMetadata()
      .rotate()
      .toFile(tempLocalThumbFile);

    const token = uuidv4();
    //Uploading thumbnail
    await bucket.upload(tempLocalThumbFile, {
      destination: thumbFilePath,
      metadata: {
        contentType: 'image/jpeg',
        metadata: {
          firebaseStorageDownloadTokens: token
        }
      }
    });
    const config = {
      action: 'read',
      expires: '03-01-2500',
    };
    //Get thumbFile URL
    const thumbFile = bucket.file(thumbFilePath);
    // const url = await thumbFile.getSignedUrl(config);
    const url = `https://firebasestorage.googleapis.com/v0/b/qkdasartuoc.appspot.com/o/${encodeURIComponent(thumbFilePath)}?alt=media&token=${token}`;

    // Update product with the value of URL
    const batch = admin.firestore().batch();
    // Image to update
    const imageToUpdate = imageSizes[size];
    // Product to update
    productRef = admin.firestore().collection(API_PRODUCT).doc(reference);
    const productGet =  await productRef.get();
    const product = productGet.data();
    // Image isMain then update product
    if(imageId === product.mainImage.id) {
      batch.update(productRef, {[`mainImage.urls.${imageToUpdate}`]: url});
    }
    // Update product
    const imageRef = productRef.collection(API_IMAGES).doc(imageId);
    batch.update(imageRef, {[`urls.${imageToUpdate}`]: url});
    // Iterate over all product agrupations and update product data
    let agr = admin.firestore().collection(API_AGRUP);
    let image;
    for (const agrupId of product.agrupation.path) {
      agr = agr.doc(agrupId);
      productAgrRef = agr.collection(API_PRODUCT).doc(product.reference);
      if(imageId === product.mainImage.id) {
        batch.update(productAgrRef, {[`mainImage.urls.${imageToUpdate}`]: url});
      }
      imageAgrRef = productAgrRef.collection(API_IMAGES).doc(imageId);
      batch.update(imageAgrRef, {[`urls.${imageToUpdate}`]: url});
      agr = agr.collection(API_AGRUP);
    }
    agr = agr.doc(product.agrupation.id);
    productAgrRef = agr.collection(API_PRODUCT).doc(product.reference);
    if(imageId === product.mainImage.id) {
      batch.update(productAgrRef, {[`mainImage.urls.${imageToUpdate}`]: url});
    }
    image = productAgrRef.collection(API_IMAGES).doc(imageId);
    batch.update(image, {[`urls.${imageToUpdate}`]: url});

    fs.unlinkSync(tempLocalThumbFile);

    await batch.commit();
  }
});

