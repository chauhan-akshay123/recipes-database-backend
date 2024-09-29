let express = require("express");
let cors = require("cors");
let sqlite3 = require("sqlite3").verbose();
let { open } = require("sqlite");

let app = express();
let PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

let db;

// Initialize sqlite database connection
(async () => {
  db = await open({
    filename: './Backend/database.sqlite',
    driver: sqlite3.Database,
  });
  console.log("Database connected.");
})();

// function to fetch all recipes by cuisine
async function filterByCuisine(cuisine){
  let query = "SELECT * FROM recipes WHERE cuisine = ?";
  let response =  await db.all(query, [cuisine]);
  return { recipes: response };
}

// Route to fetch all recipes by cuisine
app.get("/recipes/cuisine/:cuisine", async (req, res)=>{
  let cuisine = req.params.cuisine;
  try{
    let results = await filterByCuisine(cuisine);
   
    if(results.recipes.length === 0){
      res.status(404).json({ message: "No recipes found for cuisine: " + cuisine });
    }

    res.status(200).json(results);
  } catch(error){
    res.status(500).json({ error: error.message });
  }
});

// function to fetch all recipes by main_ingredient
async function fetchByIngredient(main_ingredient){
  let query = "SELECT * FROM recipes WHERE main_ingredient = ?";
  let response = await db.all(query, [main_ingredient]);
  return { recipes: response };
}


// Route to fetch all recipes by main_ingredient
app.get("/recipes/main_ingredient/:main_ingredient", async (req, res)=>{
  let main_ingredient = req.params.main_ingredient;
  try{
   let results = await fetchByIngredient(main_ingredient);
   
   if(results.recipes.length === 0){
     res.status(404).json({ message: "No recipes found for this main ingredient: "  + main_ingredient});
   }

   res.status(200).json(results);
  } catch(error){
    res.status(500).json({ error: error.message });
  }
})

// function to fetch recipes by preparation time
async function fetchByTime(preparation_time){
  let query = "SELECT * FROM recipes WHERE preparation_time = ?";
  let response = await db.all(query, [preparation_time]);
  return { recipes: response };
}


// Route to fetch recipes by Preparation Time
app.get("/recipes/preparation_time/:preparation_time", async (req, res)=>{
  let preparation_time = req.params.preparation_time;
  try{
   let results = fetchByTime(preparation_time);

   if(results.recipes.length === 0){
     res.status(404).json({ message: "No recipes found for this time: " + preparation_time });
   }

  res.status(200).json(results);
  } catch(error){
    res.status(500).json({ error: error.message });
  }
});

// function to fetch recipes by difficulty
async function fetchByDifficulty(difficulty){
  let query = "SELECT * FROM recipes WHERE difficulty = ?";
  let response = await db.all(query, [difficulty]);
  return { recipes: response };
}


// Route to fetch recipes by difficulty
app.get("/recipes/difficulty/:difficulty",  async (req, res)=>{
 let difficulty = req.params.difficulty;
 try{
   let results = await fetchByDifficulty(difficulty);
   
   if(results.recipes.length === 0){
     res.status(404).json({ message: "No recipes found for this difficulty: " + difficulty});
   }

   res.status(200).json(results);
 } catch(error){
   res.status(500).json({ error: error.message });
 }
});

// function to fetch recipes by vegetarian status
async function fetchByVegetarian(vegetarian){
  let query = "SELECT * FROM recipes WHERE vegetarian = ?";
  let response = await db.all(query, [vegetarian]);
  return { recipes: response };
}


// Route to fetch recipes by Vegetarian status
app.get("/recipes/vegetarian", async (req, res)=>{
  let vegetarian = req.params.vegetarian === "true";
  try{
    let results = await fetchByVegetarian(vegetarian);

    if(results.recipes.length === 0){
      res.status(404).json({ message: "No recipes found for status: " + vegetarian});
    }

    res.status(200).json(results);
  } catch(error){
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));