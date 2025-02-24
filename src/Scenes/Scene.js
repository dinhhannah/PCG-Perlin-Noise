class TinyTown extends Phaser.Scene {
    constructor(){
        super("TinyTown");

        this.TILE_IDS = {
            Grass: 23,
            Sand: 18,
            Stone: 28,
            Ice: 86,
            Road: 5,

        };

        this.DECORATIONS = {
            Ice_decor: [105, 106, 122, 123],
            Grass_decor: [128, 110],
            Sand_decor: [132, 128]
        };
    }

    preload(){
        this.load.spritesheet("player", "assets/player.png", { frameWidth: 64, frameHeight: 64 });
    }

    init(){
        this.mapWidth = 20;
        this.mapHeight = 15;
        this.tileSize = 64;
        this.locations = [];
        
        this.noiseSeed = Math.random();
        this.noise_window = 2;
        noise.seed(this.noiseSeed);       
    }

    create(){
        const {terrainArray, decorationArray, roads, locations} = this.generateRandomMap();
        
        // Create terrain layer
        const terrainMap = this.make.tilemap({
            data: terrainArray,
            tileWidth: this.tileSize,
            tileHeight: this.tileSize,
         });
        terrainMap.addTilesetImage("terrain-tiles");
        this.terrainLayer = terrainMap.createLayer(0, "terrain-tiles", 0, 0);
        
        // Create decoration layer
        const decorationMap = this.make.tilemap({
            data: decorationArray,
            tileWidth: this.tileSize,
            tileHeight: this.tileSize,
        });
        decorationMap.addTilesetImage("terrain-tiles");
        this.decorationLayer = decorationMap.createLayer(0, "terrain-tiles", 0, 0);

        // Set decoration layer to ignore null tiles
        this.decorationLayer.setCollisionByExclusion([-1]); // Ignores empty tiles

        this.reload = this.input.keyboard.addKey("R");
        this.shrink = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.COMMA);
        this.grow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PERIOD);
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(this.reload)) {
            this.scene.restart({ seed: Math.random(), window: this.noise_window });
        }
    
        if (Phaser.Input.Keyboard.JustDown(this.shrink)) {
            this.noise_window *= 1.1;
            this.regenerateMap();
        }
    
        if (Phaser.Input.Keyboard.JustDown(this.grow)) {
            this.noise_window *= 0.9;
            this.regenerateMap();
        }
    }
    
    generateRandomMap(){
        const width = this.mapWidth;
        const height = this.mapHeight;
        const noise_window = this.noise_window;

        let terrainArray = []; // For terrain tiles
        let decorationArray = []; // For decoration tiles

        for (let y = 0; y < height; y++){
            const terrainRow = [];
            const decorationRow = [];
            
            for (let x = 0; x < width; x++){
                const value = Math.min(Math.max(
                    noise.perlin2((x / width) * noise_window, (y / height) * noise_window), 0), 1);
                
                console.log("Noise: " + value);
                console.log("x: " + (x / 20.0) * 0.5);
                console.log("y: " + (y / 15.0) * 0.5);

                if (value < 0.15){
                    terrainRow.push(this.TILE_IDS.Grass); // Grass
                }
                
                else if(value < 0.25){
                    terrainRow.push(this.TILE_IDS.Sand); // Sand
                }
                
                else{
                    terrainRow.push(this.TILE_IDS.Ice); // Ice
                }

                // Initialize decoration row with null (no decoration)
                decorationRow.push(null);
            }
            
            terrainArray.push(terrainRow);
            decorationArray.push(decorationRow);
        }

        // Add decorations
        for (let y = 0; y < height; y++){
            for (let x = 0; x < width; x++){
                const terrainTile = terrainArray[y][x];

                let decorations = [];
    
                // Determine decorations based on terrain type
                if(terrainTile === this.TILE_IDS.Ice){
                    decorations = this.DECORATIONS.Ice_decor;
                }
                
                else if(terrainTile === this.TILE_IDS.Grass){
                    decorations = this.DECORATIONS.Grass_decor;
                }
                
                else if(terrainTile === this.TILE_IDS.Sand){
                    decorations = this.DECORATIONS.Sand_decor;
                }
    
                // Randomly place decoration
                if(decorations.length > 0 && Math.random() < 0.1){ // 10% chance to place decoration
                    const decorationTile = decorations[Math.floor(Math.random() * decorations.length)];
                    
                    if (decorationTile !== undefined){
                        decorationArray[y][x] = decorationTile;
                    }
                }
            }
        }
    
        return{terrainArray, decorationArray};
    }
    
    regenerateMap(){
        const { terrainArray, decorationArray } = this.generateRandomMap();
    
        // Destroy old layers if they exist
        if (this.terrainLayer) {
            this.terrainLayer.destroy();
        }
        if (this.decorationLayer) {
            this.decorationLayer.destroy();
        }
    
        // Create terrain layer
        const terrainMap = this.make.tilemap({
            data: terrainArray,
            tileWidth: this.tileSize,
            tileHeight: this.tileSize,
        });
        terrainMap.addTilesetImage("terrain-tiles");
        this.terrainLayer = terrainMap.createLayer(0, "terrain-tiles", 0, 0);
    
        // Create decoration layer
        const decorationMap = this.make.tilemap({
            data: decorationArray,
            tileWidth: this.tileSize,
            tileHeight: this.tileSize,
        });
        decorationMap.addTilesetImage("terrain-tiles");
        this.decorationLayer = decorationMap.createLayer(0, "terrain-tiles", 0, 0);
    
        // Set decoration layer to ignore null tiles
        this.decorationLayer.setCollisionByExclusion([-1]); // Hide null decorations
    }
}
