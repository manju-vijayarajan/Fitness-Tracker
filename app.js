document.addEventListener("DOMContentLoaded", () => {
    // Data for stats and chart
    const data = {
        totalCalories: 2752,
        totalTime: 74,
        totalSteps: 31056,
        dates: ["07/01", "07/02", "07/03", "07/04"],
        calories: [100, 200, 400, 800]
    };

    // * Ensure these elements exist before updating *
    const caloriesElement = document.getElementById("calories");
    const timeSpentElement = document.getElementById("timeSpent");
    const stepsElement = document.getElementById("steps");

    if (caloriesElement && timeSpentElement && stepsElement) {
        // * Update stats on the page *
        caloriesElement.innerText = data.totalCalories + " cal";
        timeSpentElement.innerText = data.totalTime + " min";
        stepsElement.innerText = data.totalSteps;
    } else {
        console.error("Stats elements not found in the DOM.");
    }

    // * Chart Data *
    const ctx = document.getElementById("workoutChart").getContext("2d");
    if (ctx) {
        new Chart(ctx, {
            type: "line",
            data: {
                labels: data.dates,
                datasets: [{
                    label: "Calories Burned",
                    data: data.calories,
                    borderColor: "green",
                    fill: false
                }]
            }
        });
    } else {
        console.error("Chart element not found.");
    }

    // * Display workouts on page load *
    displayWorkouts();
});

// * Function to log workout and update stats dynamically *
function logWorkout() {
    const exercise = document.getElementById("exercise").value.trim();
    const duration = document.getElementById("duration").value.trim();
    const caloriesBurned = document.getElementById("caloriesBurned").value.trim();

    if (exercise === "" || duration === "" || caloriesBurned === "") {
        alert("Please fill in all fields!");
        return;
    }

    let workouts = JSON.parse(localStorage.getItem("workouts")) || [];
    workouts.push({ exercise, duration: parseInt(duration), caloriesBurned: parseInt(caloriesBurned) });
    localStorage.setItem("workouts", JSON.stringify(workouts));

    // * Update stats dynamically *
    updateStats();

    // * Clear input fields *
    document.getElementById("exercise").value = "";
    document.getElementById("duration").value = "";
    document.getElementById("caloriesBurned").value = "";

    displayWorkouts();
}

// * Function to update stats dynamically *
function updateStats() {
    let workouts = JSON.parse(localStorage.getItem("workouts")) || [];
    
    let totalCalories = workouts.reduce((sum, workout) => sum + workout.caloriesBurned, 0);
    let totalTime = workouts.reduce((sum, workout) => sum + workout.duration, 0);
    let totalSteps = totalTime * 420; // Example: 1 min = 420 steps

    document.getElementById("calories").innerText = totalCalories + " cal";
    document.getElementById("timeSpent").innerText = totalTime + " min";
    document.getElementById("steps").innerText = totalSteps;
}

// * Function to display workouts from localStorage *


// * Function to delete a workout *
function deleteWorkout(index) {
    let workouts = JSON.parse(localStorage.getItem("workouts"));
    workouts.splice(index, 1);
    localStorage.setItem("workouts", JSON.stringify(workouts));
    displayWorkouts();
}

// * Display workouts when page loads *
window.onload = function () {
    displayWorkouts();
};

function displayWorkouts() {
    let workouts = JSON.parse(localStorage.getItem("workouts")) || [];
    let workoutList = document.getElementById("workout-list");
    workoutList.innerHTML = "";

    if (workouts.length === 0) {
        workoutList.innerHTML = "<p class='text-gray-500'>No workouts logged yet.</p>";
        return;
    }

    workouts.forEach((workout, index) => {
        let listItem = document.createElement("li");
        listItem.className = "flex justify-between bg-gray-100 p-2 rounded shadow-md";
        listItem.innerHTML = `
            <span>${workout.exercise} - ${workout.duration} min - ${workout.caloriesBurned} cal</span>
            <button onclick="deleteWorkout(${index})" class="small-delete-button">Delete</button>
        `;
        workoutList.appendChild(listItem);
    });

    // * Update stats after displaying workouts *
    updateStats();
}

// Function to update or add a new routine
function updateRoutine() {
    const exercise = document.getElementById("routineExercise").value.trim();
    const reps = document.getElementById("routineReps").value.trim();
    const sets = document.getElementById("routineSets").value.trim();

    if (exercise === "" || reps === "" || sets === "") {
        alert("Please fill in all fields!");
        return;
    }

    let routines = JSON.parse(localStorage.getItem("routines")) || [];
    let found = false;

    // Check if the exercise already exists, if so update it
    routines = routines.map(routine => {
        if (routine.exercise.toLowerCase() === exercise.toLowerCase()) {
            found = true;
            return { exercise, reps: parseInt(reps), sets: parseInt(sets) };
        }
        return routine;
    });

    if (!found) {
        // If not found, add a new entry
        routines.push({ exercise, reps: parseInt(reps), sets: parseInt(sets) });
    }

    // Save to localStorage
    localStorage.setItem("routines", JSON.stringify(routines));

    // Clear input fields
    document.getElementById("routineExercise").value = "";
    document.getElementById("routineReps").value = "";
    document.getElementById("routineSets").value = "";

    // Refresh the displayed routine list
    displayRoutines();
}

// Function to delete a routine exercise
function deleteRoutine(index) {
    let routines = JSON.parse(localStorage.getItem("routines")) || [];
    
    if (index >= 0 && index < routines.length) {
        routines.splice(index, 1);  // Remove item at the given index
        localStorage.setItem("routines", JSON.stringify(routines));
        displayRoutines();
    } else {
        console.error("Invalid routine index.");
    }
}

// Function to display routines from localStorage
function displayRoutines() {
    let routines = JSON.parse(localStorage.getItem("routines")) || [];
    let routineList = document.getElementById("routine-list");
    
    // Check if routine list element exists
    if (!routineList) {
        console.error("Routine list element not found.");
        return;
    }

    routineList.innerHTML = ""; // Clear previous items

    if (routines.length === 0) {
        routineList.innerHTML = "<p class='text-gray-500'>No routines added yet.</p>";
        return;
    }

    routines.forEach((routine, index) => {
        let listItem = document.createElement("li");
        listItem.className = "flex justify-between bg-gray-100 p-2 rounded shadow-md";
        listItem.innerHTML = `
            <span>${routine.exercise} - ${routine.reps} reps - ${routine.sets} sets</span>
            <button onclick="deleteRoutine(${index})" class="small-delete-button">Delete</button>
        `;
        routineList.appendChild(listItem);
    });
}

// Load routines when the page loads
window.onload = function () {
    displayRoutines();
};
