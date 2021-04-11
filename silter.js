class SilterJS {
  #keys = null;
  #onSearch = null;
  #hostContainer = null;

  constructor(hostId, keys, onSearch) {
    this.#keys = keys;
    this.#onSearch = onSearch;
    this.#hostContainer = document.getElementById(hostId);
  }
  #input = null;

  init() {
    var wrapper = document.createElement("div");
    wrapper.id = "silter-wrapper";
    this.#currentKeys = this.#keys;
    this.#input = document.createElement("input");
    this.#input.id = "filter-bar-input";
    this.#input.type = "text";
    this.#input.onclick = () => {
      if (!this.#opened) {
        this.#openList();
      }
    };
    this.#input.onkeyup = this.#handleInputKeyup;
    wrapper.appendChild(this.#input);
    this.#hostContainer.appendChild(wrapper);
  }

  #opened = false;
  #currentKeys = null;

  #order = ["key", "filter", "value"];
  #orderOn = 0;
  #getOrder = () => this.#order[this.#orderOn];

  #choosenFilters = [];

  #filters = {
    text: [
      { title: "Contains", key: "contains" },
      { title: "Starts With", key: "startsWith" },
      { title: "Ends With", key: "endsWith" },
      { title: "Equals", key: "equals" },
    ],
    number: [
      { title: "Bigger Than", key: "biggerThan" },
      { title: "Smaller Than", key: "smallerThan" },
      { title: "Not Equals", key: "notEquals" },
      { title: "Equals", key: "equals" },
    ],
  };

  #current = {
    key: "",
    filter: "",
    value: "",
  };


  #selectOption(optionId) { 
    this.#current[this.#getOrder()] = optionId;
    this.#orderOn++;
    if (this.#orderOn >= this.#order.length) {
      this.#orderOn = 0;
    }
    if (this.#getOrder() == "key") {
      this.#currentKeys = keys;
      this.#choosenFilters.push(this.#current);
      console.log(this.#choosenFilters);
      this.#current = {
        key: "",
        filter: "",
        value: "",
      };
    } else if (this.#getOrder() == "filter") {
      const option = keys.find((x) => x.key == optionId);
      this.#currentKeys = this.#filters[option.type];
    } else if (this.#getOrder() == "value") {
      this.#currentKeys = [];
    }
    this.#closeList();

    this.#input.value = "";
  }

  #handleInputKeyup = (e) => {
    if (e.keyCode == 13) {
      if (this.#getOrder() == "value") {
        this.#selectOption(this.#input.value);
      } else {
        if (this.#currentKeys.length > 0) {
          this.#selectOption(this.#currentKeys[0].key);
        } else {
          this.#input.value = "";
        }
      }
    } else if (/[a-zA-Z0-9 çöşüğıÇÖŞÜĞİ]/.test(e.key) && e.key.length == 1) {
      this.#closeList();
      this.#currentKeys = this.#currentKeys.filter((x) =>
        x.title.toLowerCase().includes(e.target.value.toLowerCase())
      );
      this.#openList();
    } else {
      this.#closeList();
      if (this.#getOrder() == "key") {
        this.#currentKeys = this.#keys.filter((x) =>
          x.title.toLowerCase().includes(this.#input.value.toLowerCase())
        );
      } else if (this.#getOrder() == "filter") {
        this.#currentKeys = this.#filters["text"].filter((x) =>
          x.title.toLowerCase().includes(this.#input.value.toLowerCase())
        );
      }
      this.#openList();
    }
  };

  #openList() {
    var menuDiv = document.createElement("div");
    menuDiv.id = "filter-bar-menu";
    this.#currentKeys.forEach((option) => {
      var optionDiv = document.createElement("div");
      optionDiv.classList.add("filter-bar-option");
      optionDiv.textContent = option.title;
      optionDiv.id = option.key;
      optionDiv.style.cursor = "pointer";
      optionDiv.onclick = () => this.#selectOption(option.key);

      menuDiv.appendChild(optionDiv);
    });
    this.#hostContainer.appendChild(menuDiv);
    this.#opened = true;
  }

  #closeList() {
    var menuDiv = document.getElementById("filter-bar-menu");
    if (menuDiv) {
      menuDiv.remove();
    }
    this.#opened = false;
  }
}
