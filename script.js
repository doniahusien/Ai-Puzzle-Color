
document.addEventListener("DOMContentLoaded", function() {
    const gridSize = 4; // Adjust grid size here
    const numOpacitiesPerColor = 4; // Adjust number of opacities per color
    const container = document.getElementById("container");
    const resetBtn = document.getElementById("resetBtn");
    const moveCountElement = document.getElementById("moveCount");
    let moveCount = 0;

    // Generate random colors with different opacities
    function generateRandomColors(numColors, numOpacities) {
        const colors = [];
        const opacityStep = 1 / (numOpacities + 1);
        for (let i = 0; i < numColors; i++) {
            const baseColor = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
            const colorOpacities = [];
            for (let j = 0; j < numOpacities; j++) {
                const opacity = baseColor.concat(opacityStep * (j + 1)); // Adjusted opacity for each shade
                colorOpacities.push(opacity);
            }
            colors.push(colorOpacities);
        }
        return colors;
    }

    // Shuffle array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Create the grid of shapes
    function createGrid() {
        const opacities = generateRandomColors(gridSize, numOpacitiesPerColor);
        const shuffledOpacities = shuffleArray(opacities.flat()); // Flatten and shuffle the opacities

        for (let i = 0; i < gridSize; i++) {
            const rowOpacities = shuffledOpacities.slice(i * gridSize, (i + 1) * gridSize);
            for (let j = 0; j < gridSize; j++) {
                const [r, g, b, a] = rowOpacities[j];
                const shape = document.createElement("div");
                shape.classList.add("shape");
                shape.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a})`; // Use RGBA color with varying opacity
                shape.dataset.row = i;
                shape.dataset.col = j;
                shape.addEventListener("click", handleShapeClick);
                container.appendChild(shape);
            }
        }
    }

    function handleShapeClick(event) {
        const clickedShape = event.target;
        const selectedShape = document.querySelector(".selected");
        if (selectedShape && selectedShape !== clickedShape) {
            const tempColor = selectedShape.style.backgroundColor;
            selectedShape.style.backgroundColor = clickedShape.style.backgroundColor;
            clickedShape.style.backgroundColor = tempColor;
            selectedShape.classList.remove("selected");
            moveCount++;
            moveCountElement.textContent = moveCount;
            checkWin();
        } else if (selectedShape === clickedShape) {
            clickedShape.classList.remove("selected");
        } else {
            clickedShape.classList.add("selected");
        }
    }

    // Reset the game
    function resetGame() {
        container.innerHTML = '';
        createGrid();
        moveCount = 0;
        moveCountElement.textContent = moveCount;
    }

    // Check if the player wins
    function checkWin() {
        const shapes = document.querySelectorAll(".shape");
        const rows = Array.from({ length: gridSize }, () => []);

        shapes.forEach(shape => {
            const row = parseInt(shape.dataset.row);
            const col = parseInt(shape.dataset.col);
            const color = shape.style.backgroundColor;
            rows[row][col] = color;
        });

        // Determine the direction of the opacity gradient (left to right or right to left)
        const gradientDirection = rows[0][0] < rows[0][gridSize - 1] ? "left-to-right" : "right-to-left";

        // Check if the colors in each row are arranged correctly
        const isOrdered = rows.every(row => {
            if (gradientDirection === "left-to-right") {
                return row.every((color, index) => {
                    if (index === 0) return true; // Skip the first element
                    return color >= row[index - 1]; // Check if the color has higher opacity than the previous one
                });
            } else {
                return row.every((color, index) => {
                    if (index === 0) return true; // Skip the first element
                    return color <= row[index - 1]; // Check if the color has lower opacity than the previous one
                });
            }
        });

        if (isOrdered) {
            alert("You win in " + moveCount + " moves!");
        }
    }

    // Initialize the grid
    createGrid();

    // Add event listener for reset button
    resetBtn.addEventListener("click", resetGame);
});