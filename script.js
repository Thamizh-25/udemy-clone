
document.addEventListener("DOMContentLoaded", function () {

    // HTML elements
    const searchInput = document.getElementById("courseSearch");
    const searchForm = document.getElementById("searchForm");
    const clearSearch = document.getElementById("clearSearch");
    const resultCount = document.getElementById("resultCount");

    const courseContainers = [
        document.getElementById("courseContainer"),
        document.getElementById("popularCourseContainer")
    ];

    const emptyMessages = [
        document.getElementById("recommendedEmpty"),
        document.getElementById("popularEmpty")
    ];

    const sortControls = document.querySelectorAll(".courseSort");

    const topicForm = document.getElementById("topicForm");
    const topicInput = document.getElementById("topicInput");
    const topicContainer = document.getElementById("topicContainer");
    const topicMessage = document.getElementById("topicMessage");

    // Save each section's original order.
    const originalOrders = courseContainers.map(function (container) {
        return Array.from(container.querySelectorAll(".course-card"));
    });

    const allCards = originalOrders.flat();

    // SEARCH
    function filterCourses() {
        const query = searchInput.value.trim().toLowerCase();
        let totalVisible = 0;

        courseContainers.forEach(function (container, index) {
            const cards = container.querySelectorAll(".course-card");
            let sectionVisible = 0;

            cards.forEach(function (card) {
                const title = card.querySelector("h3").textContent;
                const instructor = card.querySelector(".instructor").textContent;

                const searchableText = (
                    card.dataset.title + " " + title + " " + instructor
                ).toLowerCase();

                const matches = searchableText.includes(query);

                card.hidden = !matches;

                if (matches) {
                    sectionVisible++;
                    totalVisible++;
                }
            });

            emptyMessages[index].hidden = sectionVisible !== 0;
        });

        resultCount.textContent = query
            ? totalVisible + (totalVisible === 1
                ? " course found"
                : " courses found")
            : "Showing all " + totalVisible + " courses";

        clearSearch.hidden = query.length === 0;
    }

    searchInput.addEventListener("input", filterCourses);

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        filterCourses();
    });

    clearSearch.addEventListener("click", function () {
        searchInput.value = "";
        filterCourses();
        searchInput.focus();
    });

    // SORT EACH SECTION INDEPENDENTLY
    function sortCourses(container, originalCards, sortValue) {
        const cards = [...originalCards];

        if (sortValue === "rating") {
            cards.sort(function (a, b) {
                return Number(b.dataset.rating) - Number(a.dataset.rating);
            });
        } else if (sortValue === "reviews") {
            cards.sort(function (a, b) {
                return Number(b.dataset.reviews) - Number(a.dataset.reviews);
            });
        } else if (sortValue === "price-low") {
            cards.sort(function (a, b) {
                return Number(a.dataset.price) - Number(b.dataset.price);
            });
        } else if (sortValue === "price-high") {
            cards.sort(function (a, b) {
                return Number(b.dataset.price) - Number(a.dataset.price);
            });
        }

        // Recommended restores the original order.
        cards.forEach(function (card) {
            container.appendChild(card);
        });
    }

    sortControls.forEach(function (control, index) {
        control.addEventListener("change", function () {
            sortCourses(
                courseContainers[index],
                originalOrders[index],
                control.value
            );

            filterCourses();
        });
    });

    // ADD TOPIC SUGGESTIONS
    topicForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = topicInput.value.trim();

        if (!name) {
            topicMessage.textContent = "Please enter a topic.";
            return;
        }

        const topics = Array.from(
            topicContainer.querySelectorAll(".topic")
        );

        const duplicate = topics.some(function (topic) {
            return topic.textContent.trim().toLowerCase() === name.toLowerCase();
        });

        if (duplicate) {
            topicMessage.textContent = "This topic already exists.";
            return;
        }

        const newTopic = document.createElement("a");
        newTopic.className = "topic";
        newTopic.href = "#recommended";
        newTopic.textContent = name;

        topicContainer.appendChild(newTopic);

        topicMessage.textContent = 'Topic "' + name + '" added successfully!';
        topicInput.value = "";
        topicInput.focus();
    });

    // INITIALIZE
    filterCourses();

});
