let categories = [];
const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CAT = 5;+
$(document).ready(function() {






async function getCategoryIds() {
    const response = await axios.get('https://rithm-jeopardy.herokuapp.com/api/categories?count=100');
    const allCategories = response.data;
   
    return _.sampleSize(allCategories, NUM_CATEGORIES).map(category => category.id);  
};



async function getCategory(catId) {
    const response = await axios.get(`https://rithm-jeopardy.herokuapp.com/api/category?id=${catId}`);
    const category = response.data;
    return {
      title: category.title,
      clues: _.sampleSize(category.clues,NUM_QUESTIONS_PER_CAT).map( clue => ({
        question: clue.question,
        answer: clue.answer,
        showing: null,
      })),
    };  
}


async function fillTable() {
    categories.forEach(category => {
        let $header = $('h3').text(category.title);
        $('.header-container').append($header);
    });

    let $table = $('<table>').addClass('table-jeopardy');
    let $thead = $('<thead>');
    let $headerRow = $('<tr>');
    categories.forEach(category => {
      $headerRow.append($('<th>').text(category.title));
    });
    $thead.append($headerRow);
    $table.append($thead);
    
    let $tbody = $('<tbody>');
    for(let i = 0;i < NUM_QUESTIONS_PER_CAT; i++) {
      let $row = $('<tr>');
      for(let j = 0; j < NUM_CATEGORIES; j++) {
        //each cell shows a "?"
        $row.append($('<td>').text('?').addClass('clue').attr('data-category', j).attr('data-clue', i));
      }
      $tbody.append($row);
    }
    $table.append($tbody);
    //append complete table to container
    $('.container-model-inner').empty().append($table);
  }


function handleClick(evt) {
    let $cell = $(evt.target);
    let categoryIndex = $cell.data('category');
    let clueIndex = $cell.data('clue');
    let clue = categories[categoryIndex].clues[clueIndex];
    
        if (!clue.showing) {
        $cell.text(clue.question);
        clue.showing = 'question';
        $cell.removeClass('green-background'); // Remove green background when showing question
    } else if (clue.showing === 'question') {
        $cell.text(clue.answer);
        clue.showing = 'answer';
        $cell.addClass('green-background'); // Add green background when showing answer
    }
}



function showLoadingView() {
    $('#start-btn').text('Loading...').prop('disabled', true);
    $('#start-btn').text('Loading...').prop('disabled', true);
    $('#spinner').show(); // Show the spinner
    $('.container-model-inner').hide(); // Hide the game table
}



function hideLoadingView() {
    $('#start-btn').text('Restart').prop('disabled', false);
    $('#start-btn').text('START').prop('disabled', false);
    $('#spinner').hide(); // Hide the spinner
    $('.container-model-inner').show(); // Show the game table
}



async function setupAndStart() {
    showLoadingView();
    let categoryIds = await getCategoryIds();
    categories = [];

    for(let catId of categoryIds) {
        categories.push(await getCategory(catId));
    }

    fillTable();
    setTimeout(hideLoadingView, 6000);
    hideLoadingView();
}

$(async function() {
    $('#start-btn').on('click', setupAndStart);
    $(document).on('click', '.clue', handleClick);
});

});

