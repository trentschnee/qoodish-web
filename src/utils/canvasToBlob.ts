const getCanvasToBlob = () => {
  return import(
    /* webpackChunkName: "canvas_to_blob" */ 'blueimp-canvas-to-blob'
  );
};

const canvasToBlob = canvas => {
  return new Promise(async (resolve, reject) => {
    await getCanvasToBlob();

    canvas.toBlob(
      blob => {
        resolve(blob);
      },
      'image/jpeg',
      1.0
    );
  });
};

export default canvasToBlob;
