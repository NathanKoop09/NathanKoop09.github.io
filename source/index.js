var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    return;
  });
} 

function smoothScrollToElement(targetElement) {
  // Get the target element's position
  const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
  // Get the current scroll position
  const startPosition = window.scrollY;
  // Calculate the distance and duration of the scroll
  const distance = targetPosition - startPosition;
  const duration = 1000; // Adjust this value to control the scroll speed (in milliseconds)

  let startTime;

  function scrollAnimation(currentTime) {
    if (!startTime) startTime = currentTime;

    const timeElapsed = currentTime - startTime;
    const scrollProgress = Math.min(timeElapsed / duration, 1);
    const newScrollPosition = startPosition + distance * easeOutCubic(scrollProgress);

    window.scrollTo(0, newScrollPosition);

    if (timeElapsed < duration) {
      requestAnimationFrame(scrollAnimation);
    }
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  requestAnimationFrame(scrollAnimation);
}

function on_expand_unity(){
    toggle("expand_unity");
    expand_id("content_unity");
}

function on_expand_games(){
    toggle("expand_game");
    expand_id("content_game");
}

function on_expand_simulation(){
    toggle("expand_simulation");
    expand_id("content_simulation");
}

function on_expand_personal(){
    toggle("expand_personal");
    expand_id("content_personal");
}

function toggle(name){
    var x = document.getElementById(name);
    x.classList.toggle("active");
}

function expand_id(name){
    var content = document.getElementById(name);
    if(content.style.maxHeight){
        content.style.maxHeight = null;
    }else{
        content.style.maxHeight = content.scrollHeight+"px";
    }
}


function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
  
    // Make the textarea non-editable to avoid flickering when focusing
    textarea.setAttribute('readonly', '');
  
    // Append the textarea to the body
    document.body.appendChild(textarea);
  
    // Select the text in the textarea
    textarea.select();
  
    // Copy to clipboard
    document.execCommand('copy');
  
    // Remove the textarea from the DOM
    document.body.removeChild(textarea);
  }
  
  function changeTextOnClick(element, newText, duration) {
    // Get the original text
    const originalText = element.innerText;
    const children = Array.from(element.children);
  
    // Change the text to the new text
    element.innerText = newText;
  
    // Set a timeout to revert the text back to the original after the specified duration
    setTimeout(function () {
      element.innerText = originalText;
      element.appendChild(children);
    }, duration);
  }
  