// This is a JavaScript function that listens for the submission of the form with the ID "recipeForm". When the form is submitted, the function prevents the default behavior of form submission using e.preventDefault().

// The function then gets the user input for the ingredients, minimum protein, and maximum carbs from the form using jQuery's val() method.

// Next, the function constructs a URL with the user input and an API key for the Spoonacular API. The API key is hardcoded as b13bdf98ffa841adacba9ae9fe814f0b, and the URL is constructed using template literals to insert the user input and API key.

// The function then uses the fetch() method to make a GET request to the Spoonacular API with the constructed URL. The response from the API is parsed as JSON, and the resulting data is passed to the displayResults() function.

// If there is an error with the API request, the function logs the error to the console.

// Finally, the function clears the input fields in the form using jQuery's reset() method.

// Overall, this function enables the user to search for recipes based on ingredients and nutritional requirements, and displays the search results on the page using the displayResults() function.


$("#recipeForm").submit(function(e) {
  e.preventDefault(); // Prevent form submission

  // Get user input for ingredients and macros
  const ingredients = $("#ingredients").val();
  const minProtein = $("#minProtein").val();
  const maxCarbs = $("#maxCarbs").val();

  // Construct the URL with the user input and your API key
  const apiKey = "b13bdf98ffa841adacba9ae9fe814f0b";
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${ingredients}&minProtein=${minProtein}&maxCarbs=${maxCarbs}`;

  // Fetch recipe data from the Spoonacular API
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Display recipe data on the page
      displayResults(data);
    })
    .catch(error => console.error(error));

  // Clear the form inputs
  $("#recipeForm")[0].reset();
});




// This function, displayResults(data), is a JavaScript function that takes one argument, data. It is assumed that the data argument is an object that has a results property, which is an array of objects. Each object in the results array is assumed to have the following properties:

// title: a string representing the title of the recipe
// image: a string representing the URL of the image for the recipe
// id: a string representing the unique ID of the recipe
// The purpose of this function is to display the recipe search results in the web page. The function first empties the contents of the HTML element with the ID "output", which is assumed to be the container for the recipe search results. Then, the function loops through the results array and creates HTML elements for each recipe. Each recipe is displayed as a pair of two columns, with each column containing the HTML elements for a single recipe.

// For each recipe, the function creates a div element that contains an img element with the URL of the recipe image and the alt text of the recipe title, as well as a div element with the recipe title, a button to show more details about the recipe, and an empty div element with the ID set to the unique ID of the recipe. This empty div element will be used to display more details about the recipe when the user clicks on the "Show Recipe" button.

// The function then creates a row of two columns, with each column containing the HTML elements for a single recipe. The left column contains the HTML elements for the current recipe, and the right column contains the HTML elements for the next recipe in the results array, if there is one. If there is no next recipe in the results array, then the right column is empty.

// Finally, the function appends the row of columns to the resultsContainer, which is the HTML element with the ID "output". The result is a list of recipe search results displayed in pairs of two columns.



function displayResults(data) {
  const resultsContainer = $("#output");
  resultsContainer.empty();
  const results = data.results;

  for (let i = 0; i < results.length; i += 2) {
    const leftResult = results[i];
    const leftTitle = leftResult.title;
    const leftImage = leftResult.image;
    const leftId = leftResult.id;

    let rightHtml = "";
    if (i + 1 < results.length) {
      const rightResult = results[i + 1];
      const rightTitle = rightResult.title;
      const rightImage = rightResult.image;
      const rightId = rightResult.id;

      rightHtml = `
        <div>
          <img src="${rightImage}" alt="${rightTitle}">
          <div class="recipe-info">
            <h3>${rightTitle}</h3>
            <button class="recipeButton" data-id="${rightId}">Show Recipe</button>
            <div class="recipeDetails" id="${rightId}"></div>
          </div>
        </div>
      `;
    }

    const leftHtml = `
      <div>
        <img src="${leftImage}" alt="${leftTitle}">
        <div class="recipe-info">
          <h3>${leftTitle}</h3>
          <button class="recipeButton" data-id="${leftId}">Show Recipe</button>
          <div class="recipeDetails" id="${leftId}"></div>
        </div>
      </div>
    `;

    const rowHtml = `
      <div class="row">
        <div class="column">${leftHtml}</div>
        <div class="column">${rightHtml}</div>
      </div>
    `;

    resultsContainer.append(rowHtml);
  }
}

// The following code processes the recipe instructions returned from the Spoonacular API. The API returns the recipe instructions as a string with periods (".") used as separators. To improve the readability of the recipe instructions, this code splits the string into an array of individual sentences using the .split('. ') method. Since the recipes info was just huge sentence I made that program to make it user friendly.

// Next, the code checks if the resulting array of sentences has only one element and that element is an empty string. If so, it displays an error message to the user using the html() method to set the content of the recipeDetails element to a div with the class "error-message" containing the error message. It then shows the recipeDetails element using the show() method.

// If there are instructions for the recipe, the code creates an ordered list using a loop. The loop iterates through each sentence in the array of instructions and adds it to the recipeHtml variable as an <li> element within an ordered list. Finally, the recipeHtml variable is used to populate the recipeDetails element using the html() method.

// It's worth noting that the original API returned recipe instructions as a string with periods used as separators between sentences. To improve the formatting of the instructions for the user, this code converts the string to an ordered list. This was accomplished by splitting the string on the periods and then iterating over the resulting array of sentences to create an ordered list.

$("#output").on("click", ".recipeButton", function() {
  const id = $(this).data("id");
  const recipeDetails = $(`#${id}`);
  if (recipeDetails.html()) {
    recipeDetails.html("");
    recipeDetails.hide(); // hide the box
  } else {
    const apiKey = "b13bdf98ffa841adacba9ae9fe814f0b";
    const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const instructions = data.instructions.split('. ');
        if (instructions.length === 1 && instructions[0] === "") {
          recipeDetails.html("<div class='error-message'>Sorry, this menu does not have a recipe.</div>");
          recipeDetails.show(); // show the box
        } else {
          let recipeHtml = '<ol>';
          for (let i = 0; i < instructions.length; i++) {
            recipeHtml += `<li>${instructions[i]}</li>`;
          }
          recipeHtml += '</ol>';
          recipeDetails.html(recipeHtml);
          recipeDetails.show(); // show the box
        }
      })
      .catch(error => console.error(error));
  }
});


const navbar = document.querySelector('nav');
let prevScrollPos = window.pageYOffset;


window.addEventListener('scroll', () => {
  const currentScrollPos = window.pageYOffset;

  if (prevScrollPos > currentScrollPos) {
    // Scrolling up, show the navbar
    navbar.classList.remove('navbar-hidden');
  } else {
    // Scrolling down, hide the navbar
    navbar.classList.add('navbar-hidden');
  }

  prevScrollPos = currentScrollPos;
});

// Animation for the box
$(document).ready(function() {
  $(".welcome-box").css("opacity", "0");
  $(".welcome-box").animate({opacity: "1"}, 1000);
  $(".container").css("opacity", "0");
  $(".container").animate({opacity: "1"}, 1000);
  $(".about").css("opacity", "0");
  $(".about").animate({opacity: "1"}, 1000);
  $(".recipeDetails").css("opacity", "0");
  $(".recipeDetails").animate({opacity: "1"}, 1000);
  $("img").css("opacity", "0");
  $("img").animate({opacity: "1"}, 1000);

});

// Get the footer element
const footer = document.querySelector('.footer');

// Function to handle the scroll event
function handleScroll() {
  // Get the height of the window and the document
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // Get the current scroll position
  const scrollPosition = window.scrollY || window.pageYOffset || document.body.scrollTop || 0;

  // If the user has scrolled to the bottom of the page, show the footer
  if (windowHeight + scrollPosition >= documentHeight) {
    footer.style.transform = 'translateY(0)';
  } else {
    footer.style.transform = 'translateY(100%)';
  }
}

// Add the scroll event listener to the window
window.addEventListener('scroll', handleScroll);