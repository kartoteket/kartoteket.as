class OceanLevel {
  constructor(map) {
    const apiToken = 'pk.eyJ1IjoiYmFyZHJvdHplciIsImEiOiJjanN6MnVzNnEwM3JlNDNvb3hkYnB3enczIn0.xAJDV2NgE46QRuOuN_QfxQ'
    this.map = map;
    this.uriTemplate = `https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=${apiToken}`;
    this.zIndex = 21;
    this.layer = null;
    this.meters = 0.5;
  }


  addTo(map) {
  // create a grid layer with tiles and the correct zIndex
    this.layer = new L.GridLayer({ zIndex: this.zIndex });
    //
    // method that will be called each time a tile is requested
    //
    this.layer.createTile = (coords) => {
      // get the tile id
      // const tileId = TileUtils.getTileId(coords);
      //
      // Create a canvas element
      //
      const canvas = L.DomUtil.create('canvas', 'leaflet-tile');
      // setup canvas width and height according to the options
      const size = this.layer.getTileSize();
      canvas.width = size.x;
      canvas.height = size.y;

      // 
      // read the rasterdata and process the data
      //

      this.getTile(coords, canvas)
       .then((canvasData) => {
         this.draw(canvasData);
       });

      return canvas;
    };
    this.layer.addTo(map);
  }

      /**
   * Will get a tile based on the type of tile to fetch
   * After fetching the tile it will be transformed acording to rules, then returned in a promise
   *
   * @param  {Object} coords      - An object representing the coordinates for the tile (z,x,y)
   * @param  {HTML Canvas} canvas - The canvas where the tile should be drawn
   * @param  {Object} options     - An options object containing data on tiles, path and optional parameters
   * @return {Promise}             - A promise thet will resolve with a canvas data object
   */
  getTile(coords, canvas) {
    //
    // Load the tile, transform and return
    //
    return new Promise((resolve, reject) => {
        
      const tileUrl = this.urlFromTemplate(this.uriTemplate, coords);
      const img = new Image();

      const canvasData = {
        image: null,
        canvas: canvas,
      }

      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        canvasData.image = img;
        resolve(canvasData);
      };

      // // load the image
      img.src = tileUrl;
    });
  }


   /**
   * Draw wethod that performs some transformations before calling Draw on the base class
   * @param  {models/CanvasData} canvasData - The canvas data
   */
  draw(canvasData) {
    const canvas = canvasData.canvas;
    const ctx = canvas.getContext('2d');
    // draw and fetch data, to prevent polluting the cached data
    ctx.drawImage(canvasData.image, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //
    // Mulighet for å øke intensiteten med zoom levels
    //
    // const zoom = canvasData.z;
    // const exp = zoom < 11 ? this.intensity + ((zoom - 3) / 20) : 1;
    // const exp = zoom < 11 ? 10 : 1; //this.intensity + ((zoom - 3) / 20)
    // const intensity = scalePow()
    //   .exponent(exp)
    //   .domain([0, 256])
    //   .range([0, 256]);

    this.transform(imageData);

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Method to perform basic transformation of a Loss image.
   * The image has its loss encoded in the Green channel, we move this data to the alpha channel,
   * The RGB channels are populated with the color for forest cover (34,125,36)
   *
   * @param   {imageData} image   - Raw image data from the canvas
   * @param   {d3scale} intensity - the scale used to calculate intensity (alpha) used on high zoom levels
   * @return  {imageData}         - A modified version of the imagedata, with all values correctly moved between channels
   */
  transform(image) {
    const data = image.data;
    const redChannel = 70;
    const greenChannel = 105;
    const blueChannel = 149;
    // const redChannel = 255; // 151;
    // const greenChannel = 0; // 189;
    // const blueChannel = 0; // 61;
    //
    // The tiles are structured this way:
    // Channel 0 (Red) = forest cover in percent (0-100)
    // Channel 1 (Green) = loss (1 or 0) forest has been lost since 2000
    // Channel 2 (Blue) = lossyear (0 to 17) that is 2000 to 2017 what year the forest was lost
    //
    // If we have data in the Red channel, we use that as our alpha
    //
    // If no data we set the alpha to 0
    const length = data.length;
    for (let i = 0; i < length; i += 4) {
      // -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1)
      const height = -10000 + ((data[i] * 256 * 256 + data[i + 1] * 256 + data[i + 2]) * 0.1);
      if( height <= this.meters) {
        data[i] = redChannel;           // Red
        data[i + 1] = greenChannel;     // Green
        data[i + 2] = blueChannel;      // Blue
        data[i + 3] = 178; // Alpha
      } else {
        data[i + 3] = 0;
      }
    }
    return image;
  }

  drawMeters(meters) {
    this.meters = meters;
    this.layer.redraw();
  }

  /**
   * @memberof OceanLevel
   * @function urlFromTemplate
   * @description Creates a url from a well formed template, if template is not well formed, issues will occur
   * @param  {String} uriTemplate - A standard map tile template {z},{x},{y}
   * @param  {Object} coords      - Tile coordinates (z,x,y)
   * @return {String}             - A tile with proper coords
   */
  urlFromTemplate(uriTemplate, coords) {
    return uriTemplate.replace('{z}/{x}/{y}', coords.z + '/' + coords.x + '/' + coords.y);
  }
}