exports.hello_world = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");

}
);