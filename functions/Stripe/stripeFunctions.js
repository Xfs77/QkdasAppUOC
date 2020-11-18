const functions = require('firebase-functions');
const stripe = require('stripe')('sk_test_51HnPcFIjHFJYs4LUvmXiBnG8uCvscynq1cpGBnkTLLQwQrfOg6Us4LyLvBmwvL0aFLxBV3dH830jb3i4VtkaAz3N00yiELayqs')
const admin = require("firebase-admin");
const cors = require('cors')({origin: true});

exports.checkout = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    let docs = await admin.firestore().collection('users/').doc(req.body.userId).collection('cart').get();
    let items = [];
    docs.forEach(doc => {
      line = {
        price_data: {
          currency: 'eur',
          product_data: {
            name: doc.data().product.reference
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
      mode: 'payment',
      success_url: `http://localhost:4200/#cart/done/`,
      cancel_url: 'http://localhost:4200/#/cart',
    });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.json({ id: session.id , });

  });

});
