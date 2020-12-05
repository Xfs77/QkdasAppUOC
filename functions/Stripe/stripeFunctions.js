const functions = require('firebase-functions');
const stripe = require('stripe')('sk_test_51HnPcFIjHFJYs4LUvmXiBnG8uCvscynq1cpGBnkTLLQwQrfOg6Us4LyLvBmwvL0aFLxBV3dH830jb3i4VtkaAz3N00yiELayqs')
const admin = require("firebase-admin");
const cors = require('cors')({origin: true});
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');



exports.checkout = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    let docs = await admin.firestore().collection('users/').doc(req.body.userId).collection('cart').get();
    let userDoc = await admin.firestore().collection('users/').doc(req.body.userId).get();
    let items = [];
    docs.forEach(doc => {
      line = {
        price_data: {
          currency: 'eur',
          product_data: {
            name: doc.data().product.reference,
            description: doc.data().product.descr,
            images: [doc.data().product.mainImage.urls.imgSM]
          },
          unit_amount: doc.data().price * 100
        },
        quantity: doc.data().quantity
      }
      items.push(line);
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items,
      customer_email: `${userDoc.data().email}`,
      mode: 'payment',
      success_url: `qkdasartuoc.web.app/#catalogue`,
      cancel_url: 'qkdasartuoc.web.app/#/cart',
    });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.json({ id: session.id , });

  });

});

exports.hooks = functions.https.onRequest(async (req, res) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers['stripe-signature'];

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === 'checkout.session.completed') {

    console.log(`🔔  Payment received!`, req.body.data.object.id);
    if (req.body.data.object.id) {
      let checkoutDoc = await admin.firestore().collection('checkouts/').doc(req.body.data.object.id).get();
      const batch = admin.firestore().batch();
      let orderDoc = await admin.firestore().collection('orders/').doc(checkoutDoc.data().order).get();
      batch.update(admin.firestore().collection('orders/').doc(checkoutDoc.data().order), {status: 'Realizado'} );
      batch.update(admin.firestore().collection('users/').doc(orderDoc.data().user.id).collection('orders/').doc(orderDoc.data().id), {status: 'Pago Validado'} );
      let cartCollectionDocs = await admin.firestore().collection('users/').doc(orderDoc.data().user.id).collection('cart').get();
      cartCollectionDocs.forEach(doc => {
        batch.delete(doc.ref);
      })
      batch.commit();
      var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: 'qkdasart@gmail.com',
          pass: 'RayiEva04'
        }
      }));



      let order = orderDoc.data();
      let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style type="text/css" nonce>
    img {
        height: 70px;
        width: 44px;
        border-radius: 5px;
    }
    .line {
        display: flex;
        flex-direction: row;
        font-size: 12px;
        margin: 16px 0;
    }
    .quantity, .price, .description {
        margin-left: 16px;
    }
    .quantity, .price {
        text-align: right;
    }
    .label {
        font-weight: bold;
    }
    .description-value {
        width: 200px;
        max-height: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    @media screen and (min-width: 600px) {
    .description-value {
        width: 300px;
        }
     }
</style>
</head>

<div>Su pedido núnero ${order.id} ha sido prcesado correctamente y en breve se procederá a su preparación.</div>`

      let total_order  = 0;
      for (line of order.orderLines) {

        const total_line = line.quantity * line.price;
        total_order = total_order + total_line;

        html = html.concat(`
<div class="line">
<img src=${line.product.mainImage.urls.imgSM}>
    <div class="description">
        <div class="label description-label">Descripcion</div>
        <div class="description-value">${line.product.descr}</div>
    </div>
    <div class="quantity">
        <div class="label quantity-label">Cantidad</div>
        <div class="quantity-value">${line.quantity}</div>
    </div>
    <div class="price">
        <div class="label price-label">Precio Unit.</div>
        <div class="price-value">${line.price} €</div>
    </div>
    <div class="price">
        <div class="label price-label">Total</div>
        <div class="price-value">${total_line} €</div>
    </div>
</div>
`);
      }
      html = html.concat(`
   <div class="order-import">El importe total del pedido es de ${total_order} €. Para cualquier aclaración puede dirigirse a <a href="mailito: qkdasart@gmail.com"> qkdasart@gmail.com</a></div>
`);

      const mailOptions = {
        from: `qkdasart@gmail.com`,
        to: orderDoc.data().user.email,
        subject: `Confirmación Pedido ${order.id} `,
        html: html
      };
      return transporter.sendMail(mailOptions, (error, data) => {
        if (error) {
          console.log(error)
          return
        }
        console.log("Sent!")
      });
    }

  }

  res.sendStatus(200);
});
