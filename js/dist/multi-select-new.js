/*!
  * CoreUI multi-select-new.js v4.6.0-alpha.0 (https://coreui.io)
  * Copyright 2023 The CoreUI Team (https://github.com/orgs/coreui/people)
  * Licensed under MIT (https://coreui.io)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@popperjs/core'), require('./util/index'), require('./dom/data'), require('./dom/event-handler'), require('./dom/manipulator'), require('./dom/selector-engine'), require('./base-component')) :
  typeof define === 'function' && define.amd ? define(['@popperjs/core', './util/index', './dom/data', './dom/event-handler', './dom/manipulator', './dom/selector-engine', './base-component'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.MultiSelectNew = factory(global["@popperjs/core"], global.index, global.Data, global.EventHandler, global.Manipulator, global.SelectorEngine, global.BaseComponent));
})(this, (function (Popper, index, Data, EventHandler, Manipulator, SelectorEngine, BaseComponent) { 'use strict';

  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
    if (e) {
      for (const k in e) {
        if (k !== 'default') {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }

  const Popper__namespace = /*#__PURE__*/_interopNamespaceDefault(Popper);

  /**
   * --------------------------------------------------------------------------
   * CoreUI PRO (v4.6.0-alpha.0): multi-select.js
   * License (https://coreui.io/pro/license-new/)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'multi-select-new';
  const DATA_KEY = 'coreui.multi-select-new';
  const EVENT_KEY = `.${DATA_KEY}`;
  const DATA_API_KEY = '.data-api';
  const TAB_KEY = 'Tab';
  const RIGHT_MOUSE_BUTTON = 2;
  const SELECTOR_CLEANER = '.form-multi-select-new-cleaner';
  const SELECTOR_OPTGROUP = '.form-multi-select-new-optgroup';
  const SELECTOR_OPTION = '.form-multi-select-new-option';
  const SELECTOR_OPTIONS = '.form-multi-select-new-options';
  const SELECTOR_OPTIONS_EMPTY = '.form-multi-select-new-options-empty';
  const SELECTOR_SEARCH = '.form-multi-select-new-search';
  const SELECTOR_SELECT = '.form-multi-select-new';
  const SELECTOR_SELECTION = '.form-multi-select-new-selection';
  const EVENT_CHANGED = `changed${EVENT_KEY}`;
  const EVENT_CLICK = `click${EVENT_KEY}`;
  const EVENT_HIDE = `hide${EVENT_KEY}`;
  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
  const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
  const EVENT_KEYUP = `keyup${EVENT_KEY}`;
  const EVENT_SEARCH = `search${EVENT_KEY}`;
  const EVENT_SHOW = `show${EVENT_KEY}`;
  const EVENT_SHOWN = `shown${EVENT_KEY}`;
  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
  const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY}${DATA_API_KEY}`;
  const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
  const CLASS_NAME_CLEANER = 'form-multi-select-new-cleaner';
  const CLASS_NAME_DISABLED = 'disabled';
  const CLASS_NAME_LABEL = 'label';
  const CLASS_NAME_SELECT = 'form-multi-select-new';
  const CLASS_NAME_SELECT_DROPDOWN = 'form-multi-select-new-dropdown';
  const CLASS_NAME_SELECT_ALL = 'form-multi-select-new-all';
  const CLASS_NAME_OPTGROUP = 'form-multi-select-new-optgroup';
  const CLASS_NAME_OPTGROUP_LABEL = 'form-multi-select-new-optgroup-label';
  const CLASS_NAME_OPTION = 'form-multi-select-new-option';
  const CLASS_NAME_OPTION_WITH_CHECKBOX = 'form-multi-select-new-option-with-checkbox';
  const CLASS_NAME_OPTIONS = 'form-multi-select-new-options';
  const CLASS_NAME_OPTIONS_EMPTY = 'form-multi-select-new-options-empty';
  const CLASS_NAME_SEARCH = 'form-multi-select-new-search';
  const CLASS_NAME_SELECTED = 'form-multi-selected';
  const CLASS_NAME_SELECTION = 'form-multi-select-new-selection';
  const CLASS_NAME_SELECTION_TAGS = 'form-multi-select-new-selection-tags';
  const CLASS_NAME_SHOW = 'show';
  const CLASS_NAME_TAG = 'form-multi-select-new-tag';
  const CLASS_NAME_TAG_DELETE = 'form-multi-select-new-tag-delete';
  const CLASS_NAME_TOGGLER = 'form-multi-select-new-toggler';
  const Default = {
    cleaner: true,
    disabled: false,
    invalid: false,
    multiple: true,
    placeholder: 'Select...',
    required: false,
    options: false,
    optionsMaxHeight: 'auto',
    optionsStyle: 'checkbox',
    search: false,
    searchNoResultsLabel: 'No results found',
    selectAll: true,
    selectAllLabel: 'Select all options',
    selectionType: 'tags',
    selectionTypeCounterText: 'item(s) selected',
    valid: false
  };
  const DefaultType = {
    cleaner: 'boolean',
    disabled: 'boolean',
    invalid: 'boolean',
    multiple: 'boolean',
    placeholder: 'string',
    required: 'boolean',
    options: '(boolean|array)',
    optionsMaxHeight: '(number|string)',
    optionsStyle: 'string',
    search: 'boolean',
    searchNoResultsLabel: 'string',
    selectAll: 'boolean',
    selectAllLabel: 'string',
    selectionType: 'string',
    selectionTypeCounterText: 'string',
    valid: 'boolean'
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class MultiSelectNew extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._indicatorElement = null;
      this._selectAllElement = null;
      this._selectionElement = null;
      this._selectionCleanerElement = null;
      this._searchElement = null;
      this._togglerElement = null;
      this._optionsElement = null;
      this._clone = null;
      this._menu = null;
      this._options = this._getOptions();
      this._popper = null;
      this._search = '';
      this._selection = this._getSelectedOptions(this._options);
      if (this._config.options.length > 0) {
        this._createNativeSelect(this._config.options);
      }
      this._createSelect();
      this._addEventListeners();
      Data.set(this._element, DATA_KEY, this);
    }

    // Getters

    static get Default() {
      return Default;
    }
    static get DefaultType() {
      return DefaultType;
    }
    static get NAME() {
      return NAME;
    }

    // Public
    toggle() {
      return this._isShown() ? this.hide() : this.show();
    }
    show() {
      if (this._config.disabled || this._isShown()) {
        return;
      }
      EventHandler.trigger(this._element, EVENT_SHOW);
      this._clone.classList.add(CLASS_NAME_SHOW);
      this._clone.setAttribute('aria-expanded', true);
      EventHandler.trigger(this._element, EVENT_SHOWN);
      this._createPopper();
      if (this._config.search) {
        SelectorEngine.findOne(SELECTOR_SEARCH, this._clone).focus();
      }
    }
    hide() {
      EventHandler.trigger(this._element, EVENT_HIDE);
      if (this._popper) {
        this._popper.destroy();
      }
      this._clone.classList.remove(CLASS_NAME_SHOW);
      this._clone.setAttribute('aria-expanded', 'false');
      EventHandler.trigger(this._element, EVENT_HIDDEN);
    }
    dispose() {
      if (this._popper) {
        this._popper.destroy();
      }
      super.dispose();
    }
    search(text) {
      this._search = text.length > 0 ? text.toLowerCase() : text;
      this._filterOptionsList();
      EventHandler.trigger(this._element, EVENT_SEARCH);
    }
    update(config) {
      this._config = this._getConfig(config);
      this._options = this._getOptions();
      this._selection = this._getSelectedOptions(this._options);
      this._clone.remove();
      this._element.innerHTML = '';
      this._createNativeOptions(this._element, this._options);
      this._createSelect();
      this._addEventListeners();
    }
    selectAll(options = this._options) {
      for (const option of options) {
        if (option.disabled) {
          continue;
        }
        if (option.label) {
          this.selectAll(option.options);
          continue;
        }
        this._selectOption(option.value, option.text);
      }
    }
    deselectAll(options = this._options) {
      for (const option of options) {
        if (option.disabled) {
          continue;
        }
        if (option.label) {
          this.deselectAll(option.options);
          continue;
        }
        this._deselectOption(option.value);
      }
    }
    getValue() {
      return this._selection;
    }

    // Private

    _addEventListeners() {
      EventHandler.on(this._clone, EVENT_CLICK, () => {
        if (!this._config.disabled) {
          this.show();
        }
      });
      EventHandler.on(this._indicatorElement, EVENT_CLICK, event => {
        event.preventDefault();
        event.stopPropagation();
        this.toggle();
      });
      EventHandler.on(this._searchElement, EVENT_KEYUP, () => {
        this._onSearchChange(this._searchElement);
      });
      EventHandler.on(this._searchElement, EVENT_KEYDOWN, event => {
        const key = event.keyCode || event.charCode;
        if ((key === 8 || key === 46) && event.target.value.length === 0) {
          this._deselectLastOption();
        }
        this._searchElement.focus();
      });
      EventHandler.on(this._selectAllElement, EVENT_CLICK, event => {
        event.preventDefault();
        event.stopPropagation();
        this.selectAll();
      });
      EventHandler.on(this._optionsElement, EVENT_CLICK, event => {
        event.preventDefault();
        event.stopPropagation();
        this._onOptionsClick(event.target);
      });
      EventHandler.on(this._selectionCleanerElement, EVENT_CLICK, event => {
        if (!this._config.disabled) {
          event.preventDefault();
          event.stopPropagation();
          this.deselectAll();
        }
      });
      EventHandler.on(this._optionsElement, EVENT_KEYDOWN, event => {
        const key = event.keyCode || event.charCode;
        if (key === 13) {
          this._onOptionsClick(event.target);
          if (this._config.search) {
            SelectorEngine.findOne(SELECTOR_SEARCH, this._clone).focus();
          }
        }
      });
    }
    _getConfig(config) {
      config = {
        ...Default,
        ...(this._element.disabled && {
          disabled: true
        }),
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' ? config : {})
      };
      return config;
    }
    _getClassNames() {
      return this._element.classList.value.split(' ');
    }
    _getOptions(node = this._element) {
      if (this._config.options) {
        return this._config.options;
      }
      const nodes = Array.from(node.childNodes).filter(element => element.nodeName === 'OPTION' || element.nodeName === 'OPTGROUP');
      const options = [];
      for (const node of nodes) {
        if (node.nodeName === 'OPTION' && node.value) {
          options.push({
            value: node.value,
            text: node.innerHTML,
            selected: node.selected,
            disabled: node.disabled
          });
        }
        if (node.nodeName === 'OPTGROUP') {
          options.push({
            label: node.label,
            options: this._getOptions(node)
          });
        }
      }
      return options;
    }
    _getSelectedOptions(options) {
      const selected = [];
      for (const option of options) {
        if (typeof option.value === 'undefined') {
          this._getSelectedOptions(option.options);
          continue;
        }
        if (option.selected) {
          // Add only the last option if single select
          if (!this._config.multiple) {
            selected.length = 0;
          }
          selected.push({
            value: String(option.value),
            text: option.text
          });
        }
      }
      return selected;
    }
    _createNativeSelect(data) {
      this._element.classList.add(CLASS_NAME_SELECT);
      if (this._config.multiple) {
        this._element.setAttribute('multiple', true);
      }
      if (this._config.required) {
        this._element.setAttribute('required', true);
      }
      this._createNativeOptions(this._element, data);
    }
    _createNativeOptions(parentElement, options) {
      for (const option of options) {
        if (typeof option.options === 'undefined') {
          const opt = document.createElement('OPTION');
          opt.value = option.value;
          if (option.disabled === true) {
            opt.setAttribute('disabled', 'disabled');
          }
          if (option.selected === true) {
            opt.setAttribute('selected', 'selected');
          }
          opt.innerHTML = option.text;
          parentElement.append(opt);
        } else {
          const optgroup = document.createElement('optgroup');
          optgroup.label = option.label;
          this._createNativeOptions(optgroup, option.options);
          parentElement.append(optgroup);
        }
      }
    }
    _hideNativeSelect() {
      this._element.tabIndex = '-1';
      this._element.style.display = 'none';
    }
    _createSelect() {
      const div = document.createElement('div');
      div.classList.add(CLASS_NAME_SELECT);
      div.classList.toggle('is-invalid', this._config.invalid);
      div.classList.toggle('is-valid', this._config.valid);
      div.setAttribute('aria-expanded', 'false');
      if (this._config.disabled) {
        this._element.classList.add(CLASS_NAME_DISABLED);
      }
      for (const className of this._getClassNames()) {
        div.classList.add(className);
      }
      if (this._config.multiple && this._config.selectionType === 'tags') {
        div.classList.add(CLASS_NAME_SELECTION_TAGS);
      }
      this._clone = div;
      this._element.parentNode.insertBefore(div, this._element.nextSibling);
      this._createSelection();
      this._createButtons();
      if (this._config.search) {
        this._createSearchInput();
        this._updateSearch();
      }
      if (this._element.id) {
        this._element.setAttribute('name', `multi-select-${this._element.id}`);
      }
      this._createOptionsContainer();
      this._hideNativeSelect();
      this._updateOptionsList();
    }
    _createSelection() {
      const togglerEl = document.createElement('div');
      togglerEl.classList.add(CLASS_NAME_TOGGLER);
      this._togglerElement = togglerEl;
      const selectionEl = document.createElement('div');
      selectionEl.classList.add(CLASS_NAME_SELECTION);
      togglerEl.append(selectionEl);
      this._clone.append(togglerEl);
      this._updateSelection();
      this._selectionElement = selectionEl;
    }
    _createButtons() {
      const buttons = document.createElement('div');
      buttons.classList.add('form-multi-select-new-buttons');
      if (this._config.cleaner && this._config.multiple) {
        const cleaner = document.createElement('button');
        cleaner.type = 'button';
        cleaner.classList.add(CLASS_NAME_CLEANER);
        cleaner.style.display = 'none';
        buttons.append(cleaner);
        this._selectionCleanerElement = cleaner;
      }
      const indicator = document.createElement('button');
      indicator.type = 'button';
      indicator.classList.add('form-multi-select-new-indicator');
      buttons.append(indicator);
      this._indicatorElement = indicator;
      this._togglerElement.append(buttons);
      this._updateSelectionCleaner();
    }
    _createPopper() {
      if (typeof Popper__namespace === 'undefined') {
        throw new TypeError('CoreUI\'s multi select require Popper (https://popper.js.org)');
      }
      const popperConfig = {
        modifiers: [{
          name: 'preventOverflow',
          options: {
            boundary: 'clippingParents'
          }
        }, {
          name: 'offset',
          options: {
            offset: [0, 2]
          }
        }],
        placement: index.isRTL() ? 'bottom-end' : 'bottom-start'
      };
      this._popper = Popper__namespace.createPopper(this._togglerElement, this._menu, popperConfig);
    }
    _createSearchInput() {
      const input = document.createElement('input');
      input.classList.add(CLASS_NAME_SEARCH);
      if (this._config.disabled) {
        input.disabled = true;
      }
      this._searchElement = input;
      this._updateSearchSize();
      this._selectionElement.append(input);
    }
    _createOptionsContainer() {
      const dropdownDiv = document.createElement('div');
      dropdownDiv.classList.add(CLASS_NAME_SELECT_DROPDOWN);
      if (this._config.selectAll && this._config.multiple) {
        const selectAll = document.createElement('button');
        selectAll.classList.add(CLASS_NAME_SELECT_ALL);
        selectAll.innerHTML = this._config.selectAllLabel;
        this._selectAllElement = selectAll;
        dropdownDiv.append(selectAll);
      }
      const optionsDiv = document.createElement('div');
      optionsDiv.classList.add(CLASS_NAME_OPTIONS);
      if (this._config.optionsMaxHeight !== 'auto') {
        optionsDiv.style.maxHeight = `${this._config.optionsMaxHeight}px`;
        optionsDiv.style.overflow = 'auto';
      }
      dropdownDiv.append(optionsDiv);
      this._clone.append(dropdownDiv);
      this._createOptions(optionsDiv, this._options);
      this._optionsElement = optionsDiv;
      this._menu = dropdownDiv;
    }
    _createOptions(parentElement, options) {
      for (const option of options) {
        if (typeof option.value !== 'undefined') {
          const optionDiv = document.createElement('div');
          optionDiv.classList.add(CLASS_NAME_OPTION);
          if (option.disabled) {
            optionDiv.classList.add(CLASS_NAME_DISABLED);
          }
          if (this._config.optionsStyle === 'checkbox') {
            optionDiv.classList.add(CLASS_NAME_OPTION_WITH_CHECKBOX);
          }
          optionDiv.dataset.value = String(option.value);
          optionDiv.tabIndex = 0;
          optionDiv.innerHTML = option.text;
          parentElement.append(optionDiv);
        }
        if (typeof option.label !== 'undefined') {
          const optgroup = document.createElement('div');
          optgroup.classList.add(CLASS_NAME_OPTGROUP);
          const optgrouplabel = document.createElement('div');
          optgrouplabel.innerHTML = option.label;
          optgrouplabel.classList.add(CLASS_NAME_OPTGROUP_LABEL);
          optgroup.append(optgrouplabel);
          this._createOptions(optgroup, option.options);
          parentElement.append(optgroup);
        }
      }
    }
    _createTag(value, text) {
      const tag = document.createElement('div');
      tag.classList.add(CLASS_NAME_TAG);
      tag.dataset.value = value;
      tag.innerHTML = text;
      const closeBtn = document.createElement('button');
      closeBtn.classList.add(CLASS_NAME_TAG_DELETE, 'text-medium-emphasis');
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.innerHTML = '<span aria-hidden="true">&times;</span>';
      tag.append(closeBtn);
      EventHandler.on(closeBtn, EVENT_CLICK, event => {
        if (!this._config.disabled) {
          event.preventDefault();
          event.stopPropagation();
          tag.remove();
          this._deselectOption(value);
        }
      });
      return tag;
    }
    _onOptionsClick(element) {
      if (!element.classList.contains(CLASS_NAME_OPTION) || element.classList.contains(CLASS_NAME_LABEL)) {
        return;
      }
      const value = String(element.dataset.value);
      const text = element.textContent;
      if (this._config.multiple && element.classList.contains(CLASS_NAME_SELECTED)) {
        this._deselectOption(value);
      } else if (this._config.multiple && !element.classList.contains(CLASS_NAME_SELECTED)) {
        this._selectOption(value, text);
      } else if (!this._config.multiple) {
        this._selectOption(value, text);
      }
      if (!this._config.multiple) {
        this.hide();
        this.search('');
        this._searchElement.value = null;
      }
    }
    _selectOption(value, text) {
      if (!this._config.multiple) {
        this.deselectAll();
      }
      if (this._selection.filter(e => e.value === value).length === 0) {
        this._selection.push({
          value,
          text
        });
      }
      const nativeOption = SelectorEngine.findOne(`option[value="${value}"]`, this._element);
      if (nativeOption) {
        nativeOption.selected = true;
      }
      const option = SelectorEngine.findOne(`[data-value="${value}"]`, this._optionsElement);
      if (option) {
        option.classList.add(CLASS_NAME_SELECTED);
      }
      EventHandler.trigger(this._element, EVENT_CHANGED, {
        value: this._selection
      });
      this._updateSelection();
      this._updateSelectionCleaner();
      this._updateSearch();
      this._updateSearchSize();
    }
    _deselectOption(value) {
      const selected = this._selection.filter(e => e.value !== value);
      this._selection = selected;
      SelectorEngine.findOne(`option[value="${value}"]`, this._element).selected = false;
      const option = SelectorEngine.findOne(`[data-value="${value}"]`, this._optionsElement);
      if (option) {
        option.classList.remove(CLASS_NAME_SELECTED);
      }
      EventHandler.trigger(this._element, EVENT_CHANGED, {
        value: this._selection
      });
      this._updateSelection();
      this._updateSelectionCleaner();
      this._updateSearch();
      this._updateSearchSize();
    }
    _deselectLastOption() {
      if (this._selection.length > 0) {
        const last = this._selection.pop();
        this._deselectOption(last.value);
      }
    }
    _updateSelection() {
      const selection = SelectorEngine.findOne(SELECTOR_SELECTION, this._clone);
      const search = SelectorEngine.findOne(SELECTOR_SEARCH, this._clone);
      if (this._selection.length === 0 && !this._config.search) {
        selection.innerHTML = `<span class="form-multi-select-new-text">${this._config.placeholder}</span>`;
        return;
      }
      if (this._config.multiple && this._config.selectionType === 'counter' && !this._config.search) {
        selection.innerHTML = `<span class="form-multi-select-new-text">${this._selection.length} ${this._config.selectionTypeCounterText}</span>`;
      }
      if (this._config.multiple && this._config.selectionType === 'tags') {
        selection.innerHTML = '';
        for (const e of this._selection) {
          selection.append(this._createTag(e.value, e.text));
        }
      }
      if (this._config.multiple && this._config.selectionType === 'text') {
        selection.innerHTML = this._selection.map((option, index) => `<span>${option.text}${index === this._selection.length - 1 ? '' : ','}&nbsp;</span>`).join('');
      }
      if (!this._config.multiple && this._selection.length > 0 && !this._config.search) {
        selection.innerHTML = `<span class="form-multi-select-new-text">${this._selection[0].text}</span>`;
      }
      if (search) {
        selection.append(search);
      }
      if (this._popper) {
        this._popper.update();
      }
    }
    _updateSelectionCleaner() {
      if (!this._config.cleaner || this._selectionCleanerElement === null) {
        return;
      }
      const selectionCleaner = SelectorEngine.findOne(SELECTOR_CLEANER, this._clone);
      if (this._selection.length > 0) {
        selectionCleaner.style.removeProperty('display');
        return;
      }
      selectionCleaner.style.display = 'none';
    }
    _updateSearch() {
      if (!this._config.search) {
        return;
      }

      // Select single

      if (!this._config.multiple && this._selection.length > 0) {
        this._searchElement.placeholder = this._selection[0].text;
        return;
      }
      if (!this._config.multiple && this._selection.length === 0) {
        this._searchElement.placeholder = this._config.placeholder;
        return;
      }

      // Select multiple

      if (this._config.multiple && this._selection.length > 0 && this._config.selectionType !== 'counter') {
        this._searchElement.removeAttribute('placeholder');
        return;
      }
      if (this._config.multiple && this._selection.length === 0) {
        this._searchElement.placeholder = this._config.placeholder;
        return;
      }
      if (this._config.multiple && this._config.selectionType === 'counter') {
        this._searchElement.placeholder = `${this._selection.length} item(s) selected`;
      }
    }
    _updateSearchSize(size = 2) {
      if (!this._searchElement || !this._config.multiple) {
        return;
      }
      if (this._selection.length > 0 && (this._config.selectionType === 'tags' || this._config.selectionType === 'text')) {
        this._searchElement.size = size;
        return;
      }
      if (this._selection.length === 0 && (this._config.selectionType === 'tags' || this._config.selectionType === 'text')) {
        this._searchElement.removeAttribute('size');
      }
    }
    _onSearchChange(element) {
      if (element) {
        this.search(element.value);
        this._updateSearchSize(element.value.length + 1);
      }
    }
    _updateOptionsList(options = this._options) {
      for (const option of options) {
        if (option.label) {
          this._updateOptionsList(option.options);
          continue;
        }
        if (option.selected) {
          this._selectOption(option.value, option.text);
        }
      }
    }
    _isVisible(element) {
      const style = window.getComputedStyle(element);
      return style.display !== 'none';
    }
    _isShown() {
      return this._clone.classList.contains(CLASS_NAME_SHOW);
    }
    _filterOptionsList() {
      const options = SelectorEngine.find(SELECTOR_OPTION, this._clone);
      let visibleOptions = 0;
      for (const option of options) {
        // eslint-disable-next-line unicorn/prefer-includes
        if (option.textContent.toLowerCase().indexOf(this._search) === -1) {
          option.style.display = 'none';
        } else {
          option.style.removeProperty('display');
          visibleOptions++;
        }
        const optgroup = option.closest(SELECTOR_OPTGROUP);
        if (optgroup) {
          // eslint-disable-next-line  unicorn/prefer-array-some
          if (SelectorEngine.children(optgroup, SELECTOR_OPTION).filter(element => this._isVisible(element)).length > 0) {
            optgroup.style.removeProperty('display');
          } else {
            optgroup.style.display = 'none';
          }
        }
      }
      if (visibleOptions > 0) {
        if (SelectorEngine.findOne(SELECTOR_OPTIONS_EMPTY, this._clone)) {
          SelectorEngine.findOne(SELECTOR_OPTIONS_EMPTY, this._clone).remove();
        }
        return;
      }
      if (visibleOptions === 0) {
        const placeholder = document.createElement('div');
        placeholder.classList.add(CLASS_NAME_OPTIONS_EMPTY);
        placeholder.innerHTML = this._config.searchNoResultsLabel;
        if (!SelectorEngine.findOne(SELECTOR_OPTIONS_EMPTY, this._clone)) {
          SelectorEngine.findOne(SELECTOR_OPTIONS, this._clone).append(placeholder);
        }
      }
    }

    // Static

    static multiSelectInterface(element, config) {
      const data = MultiSelectNew.getOrCreateInstance(element, config);
      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      }
    }
    static jQueryInterface(config) {
      return this.each(function () {
        MultiSelectNew.multiSelectInterface(this, config);
      });
    }
    static clearMenus(event) {
      if (event && (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY)) {
        return;
      }
      const selects = SelectorEngine.find(SELECTOR_SELECT);
      for (let i = 0, len = selects.length; i < len; i++) {
        const context = Data.get(selects[i], DATA_KEY);
        ({
          relatedTarget: selects[i]
        });
        if (event && event.type === 'click') ;
        if (!context) {
          continue;
        }
        if (!context._clone.classList.contains(CLASS_NAME_SHOW)) {
          continue;
        }
        if (context._clone.contains(event.target)) {
          continue;
        }
        context._clone.classList.remove(CLASS_NAME_SHOW);
        EventHandler.trigger(context._element, EVENT_HIDDEN);
      }
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */
  EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
    for (const ms of SelectorEngine.find(SELECTOR_SELECT)) {
      if (ms.tabIndex !== -1) {
        MultiSelectNew.multiSelectInterface(ms);
      }
    }
  });
  EventHandler.on(document, EVENT_CLICK_DATA_API, MultiSelectNew.clearMenus);
  EventHandler.on(document, EVENT_KEYUP_DATA_API, MultiSelectNew.clearMenus);

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .MultiSelect to jQuery only if jQuery is present
   */

  index.defineJQueryPlugin(MultiSelectNew);

  return MultiSelectNew;

}));
//# sourceMappingURL=multi-select-new.js.map