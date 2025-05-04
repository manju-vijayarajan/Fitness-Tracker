const express = require("express");
const cors = require("cors");
const path =require("path");



const app = express();
const PORT = 5500;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
// Sample workout data
let workouts = [];
let routines = [];

// Get all workouts
app.get("/getWorkouts", (req, res) => {
    res.json(workouts);
});

// Log a new workout
app.post("/logWorkout", (req, res) => {
    const { exercise, duration, caloriesBurned } = req.body;
    
    if (!exercise || !duration || !caloriesBurned) {
        return res.status(400).json({ message: "All fields are required." });
    }

    workouts.push({ exercise, duration: parseInt(duration), caloriesBurned: parseInt(caloriesBurned) });
    res.json({ message: "Workout added successfully." });
});

// Delete a workout
app.delete("/deleteWorkout/:index", (req, res) => {
    const index = parseInt(req.params.index);

    if (index < 0 || index >= workouts.length) {
        return res.status(400).json({ message: "Invalid index." });
    }

    workouts.splice(index, 1);
    res.json({ message: "Workout deleted successfully." });
});

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"))
})

// Get all routines
app.get("/getRoutines", (req, res) => {
    res.json(routines);
});

// Add or update routine
app.post("/updateRoutine", (req, res) => {
    const { exercise, reps, sets } = req.body;

    if (!exercise || !reps || !sets) {
        return res.status(400).json({ message: "All fields are required." });
    }

    let found = false;
    routines = routines.map(routine => {
        if (routine.exercise.toLowerCase() === exercise.toLowerCase()) {
            found = true;
            return { exercise, reps: parseInt(reps), sets: parseInt(sets) };
        }
        return routine;
    });

    if (!found) {
        routines.push({ exercise, reps: parseInt(reps), sets: parseInt(sets) });
    }

    res.json({ message: "Routine updated successfully." });
});

// Delete a routine
app.delete("/deleteRoutine/:index", (req, res) => {
    const index = parseInt(req.params.index);

    if (index < 0 || index >= routines.length) {
        return res.status(400).json({ message: "Invalid index." });
    }

    routines.splice(index, 1);
    res.json({ message: "Routine deleted successfully." });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
