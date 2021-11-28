/**
 * --------------------------------------------------------------------------
  * CoreUI (v4.0.4): modal.js
 * Licensed under MIT (https://coreui.io/license)
 *
 * This component is a modified version of the Bootstrap's modal.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  defineJQueryPlugin,
  getElementFromSelector,
  isRTL,
  isVisible,
  reflow,
  typeCheckConfig
} from './util/index'
import EventHandler from './dom/event-handler'
import Manipulator from './dom/manipulator'
import SelectorEngine from './dom/selector-engine'
import ScrollBarHelper from './util/scrollbar'
import BaseComponent from './base-component'
import Backdrop from './util/backdrop'
import FocusTrap from './util/focustrap'
import { enableDismissTrigger } from './util/component-functions'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'modal'
const DATA_KEY = 'coreui.modal'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const ESCAPE_KEY = 'Escape'

const Default = {
  backdrop: true,
  keyboard: true,
  focus: true
}

const DefaultType = {
  backdrop: '(boolean|string)',
  keyboard: 'boolean',
  focus: 'boolean'
}

const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_RESIZE = `resize${EVENT_KEY}`
const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`
const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`
const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY}`
const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_OPEN = 'modal-open'
const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'
const CLASS_NAME_STATIC = 'modal-static'

const OPEN_SELECTOR = '.modal.show'
const SELECTOR_DIALOG = '.modal-dialog'
const SELECTOR_MODAL_BODY = '.modal-body'
const SELECTOR_DATA_TOGGLE = '[data-coreui-toggle="modal"]'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Modal extends BaseComponent {
  constructor(element, config) {
    super(element)

    this._config = this._getConfig(config)
    this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element)
    this._backdrop = this._initializeBackDrop()
    this._focustrap = this._initializeFocusTrap()
    this._isShown = false
    this._ignoreBackdropClick = false
    this._isTransitioning = false
    this._scrollBar = new ScrollBarHelper()
  }

  // Getters

  static get Default() {
    return Default
  }

  static get NAME() {
    return NAME
  }

  // Public

  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget)
  }

  show(relatedTarget) {
    if (this._isShown || this._isTransitioning) {
      return
    }

    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW, {
      relatedTarget
    })

    if (showEvent.defaultPrevented) {
      return
    }

    this._isShown = true

    if (this._isAnimated()) {
      this._isTransitioning = true
    }

    this._scrollBar.hide()

    document.body.classList.add(CLASS_NAME_OPEN)

    this._adjustDialog()

    this._setEscapeEvent()
    this._setResizeEvent()

    EventHandler.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, () => {
      EventHandler.one(this._element, EVENT_MOUSEUP_DISMISS, event => {
        if (event.target === this._element) {
          this._ignoreBackdropClick = true
        }
      })
    })

    this._showBackdrop(() => this._showElement(relatedTarget))
  }

  hide() {
    if (!this._isShown || this._isTransitioning) {
      return
    }

    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE)

    if (hideEvent.defaultPrevented) {
      return
    }

    this._isShown = false
    const isAnimated = this._isAnimated()

    if (isAnimated) {
      this._isTransitioning = true
    }

    this._setEscapeEvent()
    this._setResizeEvent()

    this._focustrap.deactivate()

    this._element.classList.remove(CLASS_NAME_SHOW)

    EventHandler.off(this._element, EVENT_CLICK_DISMISS)
    EventHandler.off(this._dialog, EVENT_MOUSEDOWN_DISMISS)

    this._queueCallback(() => this._hideModal(), this._element, isAnimated)
  }

  dispose() {
    [window, this._dialog]
      .forEach(htmlElement => EventHandler.off(htmlElement, EVENT_KEY))

    this._backdrop.dispose()
    this._focustrap.deactivate()
    super.dispose()
  }

  handleUpdate() {
    this._adjustDialog()
  }

  // Private

  _initializeBackDrop() {
    return new Backdrop({
      isVisible: Boolean(this._config.backdrop), // 'static' option will be translated to true, and booleans will keep their value
      isAnimated: this._isAnimated()
    })
  }

  _initializeFocusTrap() {
    return new FocusTrap({
      trapElement: this._element
    })
  }

  _getConfig(config) {
    config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...(typeof config === 'object' ? config : {})
    }
    typeCheckConfig(NAME, config, DefaultType)
    return config
  }

  _showElement(relatedTarget) {
    const isAnimated = this._isAnimated()
    const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog)

    if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
      // Don't move modal's DOM position
      document.body.append(this._element)
    }

    this._element.style.display = 'block'
    this._element.removeAttribute('aria-hidden')
    this._element.setAttribute('aria-modal', true)
    this._element.setAttribute('role', 'dialog')
    this._element.scrollTop = 0

    if (modalBody) {
      modalBody.scrollTop = 0
    }

    if (isAnimated) {
      reflow(this._element)
    }

    this._element.classList.add(CLASS_NAME_SHOW)

    const transitionComplete = () => {
      if (this._config.focus) {
        this._focustrap.activate()
      }

      this._isTransitioning = false
      EventHandler.trigger(this._element, EVENT_SHOWN, {
        relatedTarget
      })
    }

    this._queueCallback(transitionComplete, this._dialog, isAnimated)
  }

  _setEscapeEvent() {
    if (this._isShown) {
      EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
        if (this._config.keyboard && event.key === ESCAPE_KEY) {
          event.preventDefault()
          this.hide()
        } else if (!this._config.keyboard && event.key === ESCAPE_KEY) {
          this._triggerBackdropTransition()
        }
      })
    } else {
      EventHandler.off(this._element, EVENT_KEYDOWN_DISMISS)
    }
  }

  _setResizeEvent() {
    if (this._isShown) {
      EventHandler.on(window, EVENT_RESIZE, () => this._adjustDialog())
    } else {
      EventHandler.off(window, EVENT_RESIZE)
    }
  }

  _hideModal() {
    this._element.style.display = 'none'
    this._element.setAttribute('aria-hidden', true)
    this._element.removeAttribute('aria-modal')
    this._element.removeAttribute('role')
    this._isTransitioning = false
    this._backdrop.hide(() => {
      document.body.classList.remove(CLASS_NAME_OPEN)
      this._resetAdjustments()
      this._scrollBar.reset()
      EventHandler.trigger(this._element, EVENT_HIDDEN)
    })
  }

  _showBackdrop(callback) {
    EventHandler.on(this._element, EVENT_CLICK_DISMISS, event => {
      if (this._ignoreBackdropClick) {
        this._ignoreBackdropClick = false
        return
      }

      if (event.target !== event.currentTarget) {
        return
      }

      if (this._config.backdrop === true) {
        this.hide()
      } else if (this._config.backdrop === 'static') {
        this._triggerBackdropTransition()
      }
    })

    this._backdrop.show(callback)
  }

  _isAnimated() {
    return this._element.classList.contains(CLASS_NAME_FADE)
  }

  _triggerBackdropTransition() {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED)
    if (hideEvent.defaultPrevented) {
      return
    }

    const { classList, scrollHeight, style } = this._element
    const isModalOverflowing = scrollHeight > document.documentElement.clientHeight

    // return if the following background transition hasn't yet completed
    if ((!isModalOverflowing && style.overflowY === 'hidden') || classList.contains(CLASS_NAME_STATIC)) {
      return
    }

    if (!isModalOverflowing) {
      style.overflowY = 'hidden'
    }

    classList.add(CLASS_NAME_STATIC)
    this._queueCallback(() => {
      classList.remove(CLASS_NAME_STATIC)
      if (!isModalOverflowing) {
        this._queueCallback(() => {
          style.overflowY = ''
        }, this._dialog)
      }
    }, this._dialog)

    this._element.focus()
  }

  // ----------------------------------------------------------------------
  // the following methods are used to handle overflowing modals
  // ----------------------------------------------------------------------

  _adjustDialog() {
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight
    const scrollbarWidth = this._scrollBar.getWidth()
    const isBodyOverflowing = scrollbarWidth > 0

    if ((!isBodyOverflowing && isModalOverflowing && !isRTL()) || (isBodyOverflowing && !isModalOverflowing && isRTL())) {
      this._element.style.paddingLeft = `${scrollbarWidth}px`
    }

    if ((isBodyOverflowing && !isModalOverflowing && !isRTL()) || (!isBodyOverflowing && isModalOverflowing && isRTL())) {
      this._element.style.paddingRight = `${scrollbarWidth}px`
    }
  }

  _resetAdjustments() {
    this._element.style.paddingLeft = ''
    this._element.style.paddingRight = ''
  }

  // Static

  static jQueryInterface(config, relatedTarget) {
    return this.each(function () {
      const data = Modal.getOrCreateInstance(this, config)

      if (typeof config !== 'string') {
        return
      }

      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`)
      }

      data[config](relatedTarget)
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  const target = getElementFromSelector(this)

  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault()
  }

  EventHandler.one(target, EVENT_SHOW, showEvent => {
    if (showEvent.defaultPrevented) {
      // only register focus restorer if modal will actually get shown
      return
    }

    EventHandler.one(target, EVENT_HIDDEN, () => {
      if (isVisible(this)) {
        this.focus()
      }
    })
  })

  // avoid conflict when clicking moddal toggler while another one is open
  const allReadyOpen = SelectorEngine.findOne(OPEN_SELECTOR)
  if (allReadyOpen) {
    Modal.getInstance(allReadyOpen).hide()
  }

  const data = Modal.getOrCreateInstance(target)

  data.toggle(this)
})

enableDismissTrigger(Modal)

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Modal to jQuery only if jQuery is present
 */

defineJQueryPlugin(Modal)

export default Modal
