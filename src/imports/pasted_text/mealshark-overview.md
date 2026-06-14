About
MealShark is a web app designed for fitness enthusiasts to plan and track their meals and nutrition to meet their fitness goals. 

User Stories
 Action
Benefit
 Priority
I want to create an account 
So that I can save my own specific meal plans and recipes 
 High
I want to set my weight change goals 
e.g. gain 0.5kg per week
So that I can calculate my calorie goals
 High
I want to calculate my calorie goals
So that I can plan my meals
 High
I want to create meal plans
So that I can meet my nutritional needs
 High
I want to create recipes
So that I can add them to my meal plans
 High
I want to see provided recipes 
So that I do not have to think about how and what to create for recipes and simply follow 
 Medium
I want to see provided meal plans 
So that I do not have to think about how and what to create for meal plans and simply follow 
 Medium


Glossary
Nutrition goal: Includes the following data specific to each user:
Total daily energy expenditure (TDEE) 
Recommended daily calorie intake
Recommended daily macros
Nutrition info: Includes the following data specific to each meal/recipe/food:
Calories
Macros
Food: A basic food item e.g. chicken breast, broccoli, rice, spaghetti, olive oil etc
Include calories and macros per unit mass, e.g. chicken breast: 165 calories, 31g protein per 100g
Include average cost (?)
Recipe: A combination of foods (ingredients) with specified amounts
e.g. Chicken chop: 200g chicken thigh, 1 tbsp olive oil, 1 tbsp paprika
e.g. Aglio olio spaghetti: 100g spaghetti, 80ml olive oil, 6 cloves garlic
A recipe can be reused by any number of meals
Include total calories and macros
Include preparation instructions
Meal: A combination of recipes and/or foods
e.g. Aglio olio spaghetti with chicken chop: 1 x Aglio olio spaghetti + 1 x Chicken chop
e.g. Aglio olio spaghetti with double chicken chop: 1 x Aglio olio spaghetti + 2 x Chicken chop
 Aglio olio spaghetti with salmon: 1 x Aglio olio spaghetti + 2 x Chicken chop
Include total calories and macros
The distinction between recipes and meals is simply to give the user more flexibility to combine foods/recipes in different ways
Meal log: A record of a meal eaten at a specific datetime
e.g. Aglio olio spaghetti with chicken chop (12 May 2026)
Meal plan: A week-level plan assigning a meal to each meal slot for each day of the week
Meal slot: e.g. Meal 1, Meal 2, referring to a meal eaten at a specific time of day
e.g. Mon: 
Meal 1: Protein smoothie
Meal 2: Aglio olio spaghetti with chicken chop
Meal 3: Ground beef, eggs and rice
Tue:
Meal 1: Protein smoothie
Meal 2: Chicken breast, broccoli and rice
Meal 3: Chicken stew with potatoes and carrots
etc
Or a fixed plan every day
Meal list: List of all meals including those created by the user and those provided by the app
Recipe list: List of all recipes including those created by the user and those provided by the app
Features
User Auth 
Register/Login 
User profile 
Calculate Recommended Macros and Calorie Intake
User enters age, gender, height, weight, activity level
User enters their weight change goal:
Lose weight (0.25kg or 0.5kg a week)
Maintain weight
Gain weight (0.25kg or 0.5kg a week)
App generates, saves and displays the following nutrition goal:
Total daily energy expenditure (TDEE) 
Recommended daily calorie intake
Recommended daily macros
View Meal Plans
User views their current active meal plan
User views all their created/generated meal plans
View All Recipes
User views the recipe list
User can search, filter and sort the recipe list
App displays the nutrition info of each meal
View Recipe
User views the recipe list
User selects a specific recipe
App displays detailed information for that recipe
Ingredients
Nutrition info
Instructions for preparation
Save Recipe
User views a specific recipe
User saves the recipe to their saved recipes
View My Recipes
User views the list of recipes that they created
View Saved Recipes
User views the list of recipes that they saved
View Foods
User views the food database
Create Meal Plan
User chooses to manually create their own meal plan
For each day of the week, user may add or remove meal slots based on the number of meals they intend to eat in a day
User selects a specific meal slot for that day
User views the recipe list and food list
User selects 1 or more items from the recipe list and/or food list
User assigns the recipes and/or foods to that meal slot
User repeats steps for each meal slot
App displays the total nutrition info for the meal plan
Generate Meal Plan
User requests system to auto-generate a meal plan based on their nutrition goal
User can subsequently edit the generated meal plan
App displays the nutrition info for each day
Create Recipe
User chooses to create their own recipe
User views the food database
User adds 1 or more food items to the recipe
User specifies the amount of each food item
App displays the nutrition info of the recipe
Log a Meal
User selects a particular date
App displays a list of meal slots for that day, each of which is initially empty
User selects a specific meal slot for that day
User views the recipe list and food list
User selects 1 or more items from the recipe list and/or food list
User logs the recipes and/or foods in that meal slot
User repeats steps for each meal slot
App displays the total nutrition info for:
Each meal
The whole day
