(() => {
    "use strict";
    const flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    const functions_element = document.querySelector(".menu__link");
    functions_element.addEventListener("click", myFunction);
    function myFunction() {
        document.querySelector(".webp").classList.remove("menu-open");
    }
    function menuClose() {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
    }
    function FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
        const targetBlockElement = document.querySelector(targetBlock);
        if (targetBlockElement) {
            let headerItem = "";
            let headerItemHeight = 0;
            if (noHeader) {
                headerItem = "header.header";
                headerItemHeight = document.querySelector(headerItem).offsetHeight;
            }
            let options = {
                speedAsDuration: true,
                speed,
                header: headerItem,
                offset: offsetTop,
                easing: "easeOutQuad"
            };
            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
            if (typeof SmoothScroll !== "undefined") (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
                let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
                targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
                targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
                window.scrollTo({
                    top: targetBlockElementPosition,
                    behavior: "smooth"
                });
            }
            FLS(`[gotoBlock]: Юхуу...едем к ${targetBlock}`);
        } else FLS(`[gotoBlock]: Ой ой..Такого блока нет на странице: ${targetBlock}`);
    };
    function formFieldsInit(options = {
        viewPass: false
    }) {
        const formFields = document.querySelectorAll("input[placeholder],textarea[placeholder]");
        if (formFields.length) formFields.forEach((formField => {
            if (!formField.hasAttribute("data-placeholder-nohide")) formField.dataset.placeholder = formField.placeholder;
        }));
        document.body.addEventListener("focusin", (function(e) {
            const targetElement = e.target;
            if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
                if (targetElement.dataset.placeholder) targetElement.placeholder = "";
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.add("_form-focus");
                    targetElement.parentElement.classList.add("_form-focus");
                }
                formValidate.removeError(targetElement);
            }
        }));
        document.body.addEventListener("focusout", (function(e) {
            const targetElement = e.target;
            if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
                if (targetElement.dataset.placeholder) targetElement.placeholder = targetElement.dataset.placeholder;
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.remove("_form-focus");
                    targetElement.parentElement.classList.remove("_form-focus");
                }
                if (targetElement.hasAttribute("data-validate")) formValidate.validateInput(targetElement);
            }
        }));
        if (options.viewPass) document.addEventListener("click", (function(e) {
            let targetElement = e.target;
            if (targetElement.closest('[class*="__viewpass"]')) {
                let inputType = targetElement.classList.contains("_viewpass-active") ? "password" : "text";
                targetElement.parentElement.querySelector("input").setAttribute("type", inputType);
                targetElement.classList.toggle("_viewpass-active");
            }
        }));
    }
    let formValidate = {
        getErrors(form) {
            let error = 0;
            let formRequiredItems = form.querySelectorAll("*[data-required]");
            if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
                if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
            }));
            return error;
        },
        validateInput(formRequiredItem) {
            let error = 0;
            let exp = /\+7\s?[\(]{0,1}9[0-9]{2}[\)]{0,1}\s?\d{3}[-]{0,1}\d{2}[-]{0,1}\d{2}/;
            if (formRequiredItem.dataset.required === "email") {
                formRequiredItem.value = formRequiredItem.value.replace(" ", "");
                if (this.emailTest(formRequiredItem)) {
                    this.addError(formRequiredItem);
                    error++;
                } else this.removeError(formRequiredItem);
            } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
                this.addError(formRequiredItem);
                error++;
            } else if (formRequiredItem.classList.contains("callback__phone") && !exp.test(formRequiredItem.value)) {
                this.addError(formRequiredItem);
                error++;
            } else if (!formRequiredItem.value) {
                this.addError(formRequiredItem);
                error++;
            } else this.removeError(formRequiredItem);
            return error;
        },
        addError(formRequiredItem) {
            formRequiredItem.classList.add("_form-error");
            formRequiredItem.parentElement.classList.add("_form-error");
            let inputError = formRequiredItem.parentElement.querySelector(".form__error");
            if (inputError) formRequiredItem.parentElement.removeChild(inputError);
            if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        },
        removeError(formRequiredItem) {
            formRequiredItem.classList.remove("_form-error");
            formRequiredItem.parentElement.classList.remove("_form-error");
            if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
        },
        formClean(form) {
            form.reset();
            setTimeout((() => {
                let inputs = form.querySelectorAll("input,textarea");
                for (let index = 0; index < inputs.length; index++) {
                    const el = inputs[index];
                    el.parentElement.classList.remove("_form-focus");
                    el.classList.remove("_form-focus");
                    formValidate.removeError(el);
                }
                let checkboxes = form.querySelectorAll(".checkbox__input");
                if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
                if (flsModules.select) {
                    let selects = form.querySelectorAll(".select");
                    if (selects.length) for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector("select");
                        flsModules.select.selectBuild(select);
                    }
                }
            }), 0);
        },
        emailTest(formRequiredItem) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
        }
    };
    function formSubmit(options = {
        validate: true
    }) {
        const forms = document.forms;
        if (forms.length) for (const form of forms) {
            form.addEventListener("submit", (function(e) {
                const form = e.target;
                formSubmitAction(form, e);
            }));
            form.addEventListener("reset", (function(e) {
                const form = e.target;
                formValidate.formClean(form);
            }));
        }
        async function formSubmitAction(form, e) {
            const error = !form.hasAttribute("data-no-validate") ? formValidate.getErrors(form) : 0;
            if (error === 0) {
                const ajax = form.hasAttribute("data-ajax");
                if (ajax) {
                    e.preventDefault();
                    const formAction = form.getAttribute("action") ? form.getAttribute("action").trim() : "#";
                    const formMethod = form.getAttribute("method") ? form.getAttribute("method").trim() : "GET";
                    const formData = new FormData(form);
                    form.classList.add("_sending");
                    const response = await fetch(formAction, {
                        method: formMethod,
                        body: formData
                    });
                    if (response.ok) {
                        await response.json();
                        form.classList.remove("_sending");
                        formSent(form);
                    } else {
                        alert("Ошибка");
                        form.classList.remove("_sending");
                    }
                } else if (form.hasAttribute("data-dev")) {
                    e.preventDefault();
                    formSent(form);
                }
            } else {
                e.preventDefault();
                const formError = form.querySelector("._form-error");
                if (formError && form.hasAttribute("data-goto-error")) gotoblock_gotoBlock(formError, true, 1e3);
            }
        }
        function formSent(form) {
            document.dispatchEvent(new CustomEvent("formSent", {
                detail: {
                    form
                }
            }));
            setTimeout((() => {
                if (flsModules.popup) {
                    const popup = form.dataset.popupMessage;
                    popup ? flsModules.popup.open(popup) : null;
                }
            }), 0);
            formValidate.formClean(form);
            formLogging(`Форма отправлена!`);
        }
        function formLogging(message) {
            FLS(`[Формы]: ${message}`);
        }
    }
    function getWindow_getWindow(node) {
        if (node == null) return window;
        if (node.toString() !== "[object Window]") {
            var ownerDocument = node.ownerDocument;
            return ownerDocument ? ownerDocument.defaultView || window : window;
        }
        return node;
    }
    function isElement(node) {
        var OwnElement = getWindow_getWindow(node).Element;
        return node instanceof OwnElement || node instanceof Element;
    }
    function isHTMLElement(node) {
        var OwnElement = getWindow_getWindow(node).HTMLElement;
        return node instanceof OwnElement || node instanceof HTMLElement;
    }
    function isShadowRoot(node) {
        if (typeof ShadowRoot === "undefined") return false;
        var OwnElement = getWindow_getWindow(node).ShadowRoot;
        return node instanceof OwnElement || node instanceof ShadowRoot;
    }
    var math_max = Math.max;
    var math_min = Math.min;
    var round = Math.round;
    function getUAString() {
        var uaData = navigator.userAgentData;
        if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) return uaData.brands.map((function(item) {
            return item.brand + "/" + item.version;
        })).join(" ");
        return navigator.userAgent;
    }
    function isLayoutViewport() {
        return !/^((?!chrome|android).)*safari/i.test(getUAString());
    }
    function getBoundingClientRect(element, includeScale, isFixedStrategy) {
        if (includeScale === void 0) includeScale = false;
        if (isFixedStrategy === void 0) isFixedStrategy = false;
        var clientRect = element.getBoundingClientRect();
        var scaleX = 1;
        var scaleY = 1;
        if (includeScale && isHTMLElement(element)) {
            scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
            scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
        }
        var _ref = isElement(element) ? getWindow_getWindow(element) : window, visualViewport = _ref.visualViewport;
        var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
        var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
        var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
        var width = clientRect.width / scaleX;
        var height = clientRect.height / scaleY;
        return {
            width,
            height,
            top: y,
            right: x + width,
            bottom: y + height,
            left: x,
            x,
            y
        };
    }
    function getWindowScroll(node) {
        var win = getWindow_getWindow(node);
        var scrollLeft = win.pageXOffset;
        var scrollTop = win.pageYOffset;
        return {
            scrollLeft,
            scrollTop
        };
    }
    function getHTMLElementScroll(element) {
        return {
            scrollLeft: element.scrollLeft,
            scrollTop: element.scrollTop
        };
    }
    function getNodeScroll(node) {
        if (node === getWindow_getWindow(node) || !isHTMLElement(node)) return getWindowScroll(node); else return getHTMLElementScroll(node);
    }
    function getNodeName(element) {
        return element ? (element.nodeName || "").toLowerCase() : null;
    }
    function getDocumentElement(element) {
        return ((isElement(element) ? element.ownerDocument : element.document) || window.document).documentElement;
    }
    function getWindowScrollBarX(element) {
        return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
    }
    function getComputedStyle_getComputedStyle(element) {
        return getWindow_getWindow(element).getComputedStyle(element);
    }
    function isScrollParent(element) {
        var _getComputedStyle = getComputedStyle_getComputedStyle(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
        return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
    }
    function isElementScaled(element) {
        var rect = element.getBoundingClientRect();
        var scaleX = round(rect.width) / element.offsetWidth || 1;
        var scaleY = round(rect.height) / element.offsetHeight || 1;
        return scaleX !== 1 || scaleY !== 1;
    }
    function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
        if (isFixed === void 0) isFixed = false;
        var isOffsetParentAnElement = isHTMLElement(offsetParent);
        var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
        var documentElement = getDocumentElement(offsetParent);
        var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
        var scroll = {
            scrollLeft: 0,
            scrollTop: 0
        };
        var offsets = {
            x: 0,
            y: 0
        };
        if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
            if (getNodeName(offsetParent) !== "body" || isScrollParent(documentElement)) scroll = getNodeScroll(offsetParent);
            if (isHTMLElement(offsetParent)) {
                offsets = getBoundingClientRect(offsetParent, true);
                offsets.x += offsetParent.clientLeft;
                offsets.y += offsetParent.clientTop;
            } else if (documentElement) offsets.x = getWindowScrollBarX(documentElement);
        }
        return {
            x: rect.left + scroll.scrollLeft - offsets.x,
            y: rect.top + scroll.scrollTop - offsets.y,
            width: rect.width,
            height: rect.height
        };
    }
    function getLayoutRect(element) {
        var clientRect = getBoundingClientRect(element);
        var width = element.offsetWidth;
        var height = element.offsetHeight;
        if (Math.abs(clientRect.width - width) <= 1) width = clientRect.width;
        if (Math.abs(clientRect.height - height) <= 1) height = clientRect.height;
        return {
            x: element.offsetLeft,
            y: element.offsetTop,
            width,
            height
        };
    }
    function getParentNode(element) {
        if (getNodeName(element) === "html") return element;
        return element.assignedSlot || element.parentNode || (isShadowRoot(element) ? element.host : null) || getDocumentElement(element);
    }
    function getScrollParent(node) {
        if ([ "html", "body", "#document" ].indexOf(getNodeName(node)) >= 0) return node.ownerDocument.body;
        if (isHTMLElement(node) && isScrollParent(node)) return node;
        return getScrollParent(getParentNode(node));
    }
    function listScrollParents(element, list) {
        var _element$ownerDocumen;
        if (list === void 0) list = [];
        var scrollParent = getScrollParent(element);
        var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
        var win = getWindow_getWindow(scrollParent);
        var target = isBody ? [ win ].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
        var updatedList = list.concat(target);
        return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target)));
    }
    function isTableElement(element) {
        return [ "table", "td", "th" ].indexOf(getNodeName(element)) >= 0;
    }
    function getTrueOffsetParent(element) {
        if (!isHTMLElement(element) || getComputedStyle_getComputedStyle(element).position === "fixed") return null;
        return element.offsetParent;
    }
    function getContainingBlock(element) {
        var isFirefox = /firefox/i.test(getUAString());
        var isIE = /Trident/i.test(getUAString());
        if (isIE && isHTMLElement(element)) {
            var elementCss = getComputedStyle_getComputedStyle(element);
            if (elementCss.position === "fixed") return null;
        }
        var currentNode = getParentNode(element);
        if (isShadowRoot(currentNode)) currentNode = currentNode.host;
        while (isHTMLElement(currentNode) && [ "html", "body" ].indexOf(getNodeName(currentNode)) < 0) {
            var css = getComputedStyle_getComputedStyle(currentNode);
            if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || [ "transform", "perspective" ].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") return currentNode; else currentNode = currentNode.parentNode;
        }
        return null;
    }
    function getOffsetParent(element) {
        var window = getWindow_getWindow(element);
        var offsetParent = getTrueOffsetParent(element);
        while (offsetParent && isTableElement(offsetParent) && getComputedStyle_getComputedStyle(offsetParent).position === "static") offsetParent = getTrueOffsetParent(offsetParent);
        if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle_getComputedStyle(offsetParent).position === "static")) return window;
        return offsetParent || getContainingBlock(element) || window;
    }
    var enums_top = "top";
    var bottom = "bottom";
    var right = "right";
    var left = "left";
    var auto = "auto";
    var basePlacements = [ enums_top, bottom, right, left ];
    var start = "start";
    var end = "end";
    var clippingParents = "clippingParents";
    var viewport = "viewport";
    var popper = "popper";
    var reference = "reference";
    var variationPlacements = basePlacements.reduce((function(acc, placement) {
        return acc.concat([ placement + "-" + start, placement + "-" + end ]);
    }), []);
    var enums_placements = [].concat(basePlacements, [ auto ]).reduce((function(acc, placement) {
        return acc.concat([ placement, placement + "-" + start, placement + "-" + end ]);
    }), []);
    var beforeRead = "beforeRead";
    var read = "read";
    var afterRead = "afterRead";
    var beforeMain = "beforeMain";
    var main = "main";
    var afterMain = "afterMain";
    var beforeWrite = "beforeWrite";
    var write = "write";
    var afterWrite = "afterWrite";
    var modifierPhases = [ beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite ];
    function order(modifiers) {
        var map = new Map;
        var visited = new Set;
        var result = [];
        modifiers.forEach((function(modifier) {
            map.set(modifier.name, modifier);
        }));
        function sort(modifier) {
            visited.add(modifier.name);
            var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
            requires.forEach((function(dep) {
                if (!visited.has(dep)) {
                    var depModifier = map.get(dep);
                    if (depModifier) sort(depModifier);
                }
            }));
            result.push(modifier);
        }
        modifiers.forEach((function(modifier) {
            if (!visited.has(modifier.name)) sort(modifier);
        }));
        return result;
    }
    function orderModifiers(modifiers) {
        var orderedModifiers = order(modifiers);
        return modifierPhases.reduce((function(acc, phase) {
            return acc.concat(orderedModifiers.filter((function(modifier) {
                return modifier.phase === phase;
            })));
        }), []);
    }
    function debounce(fn) {
        var pending;
        return function() {
            if (!pending) pending = new Promise((function(resolve) {
                Promise.resolve().then((function() {
                    pending = void 0;
                    resolve(fn());
                }));
            }));
            return pending;
        };
    }
    function mergeByName(modifiers) {
        var merged = modifiers.reduce((function(merged, current) {
            var existing = merged[current.name];
            merged[current.name] = existing ? Object.assign({}, existing, current, {
                options: Object.assign({}, existing.options, current.options),
                data: Object.assign({}, existing.data, current.data)
            }) : current;
            return merged;
        }), {});
        return Object.keys(merged).map((function(key) {
            return merged[key];
        }));
    }
    var DEFAULT_OPTIONS = {
        placement: "bottom",
        modifiers: [],
        strategy: "absolute"
    };
    function areValidElements() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
        return !args.some((function(element) {
            return !(element && typeof element.getBoundingClientRect === "function");
        }));
    }
    function popperGenerator(generatorOptions) {
        if (generatorOptions === void 0) generatorOptions = {};
        var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
        return function createPopper(reference, popper, options) {
            if (options === void 0) options = defaultOptions;
            var state = {
                placement: "bottom",
                orderedModifiers: [],
                options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
                modifiersData: {},
                elements: {
                    reference,
                    popper
                },
                attributes: {},
                styles: {}
            };
            var effectCleanupFns = [];
            var isDestroyed = false;
            var instance = {
                state,
                setOptions: function setOptions(setOptionsAction) {
                    var options = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
                    cleanupModifierEffects();
                    state.options = Object.assign({}, defaultOptions, state.options, options);
                    state.scrollParents = {
                        reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
                        popper: listScrollParents(popper)
                    };
                    var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers)));
                    state.orderedModifiers = orderedModifiers.filter((function(m) {
                        return m.enabled;
                    }));
                    runModifierEffects();
                    return instance.update();
                },
                forceUpdate: function forceUpdate() {
                    if (isDestroyed) return;
                    var _state$elements = state.elements, reference = _state$elements.reference, popper = _state$elements.popper;
                    if (!areValidElements(reference, popper)) return;
                    state.rects = {
                        reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === "fixed"),
                        popper: getLayoutRect(popper)
                    };
                    state.reset = false;
                    state.placement = state.options.placement;
                    state.orderedModifiers.forEach((function(modifier) {
                        return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
                    }));
                    for (var index = 0; index < state.orderedModifiers.length; index++) {
                        if (state.reset === true) {
                            state.reset = false;
                            index = -1;
                            continue;
                        }
                        var _state$orderedModifie = state.orderedModifiers[index], fn = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
                        if (typeof fn === "function") state = fn({
                            state,
                            options: _options,
                            name,
                            instance
                        }) || state;
                    }
                },
                update: debounce((function() {
                    return new Promise((function(resolve) {
                        instance.forceUpdate();
                        resolve(state);
                    }));
                })),
                destroy: function destroy() {
                    cleanupModifierEffects();
                    isDestroyed = true;
                }
            };
            if (!areValidElements(reference, popper)) return instance;
            instance.setOptions(options).then((function(state) {
                if (!isDestroyed && options.onFirstUpdate) options.onFirstUpdate(state);
            }));
            function runModifierEffects() {
                state.orderedModifiers.forEach((function(_ref) {
                    var name = _ref.name, _ref$options = _ref.options, options = _ref$options === void 0 ? {} : _ref$options, effect = _ref.effect;
                    if (typeof effect === "function") {
                        var cleanupFn = effect({
                            state,
                            name,
                            instance,
                            options
                        });
                        var noopFn = function noopFn() {};
                        effectCleanupFns.push(cleanupFn || noopFn);
                    }
                }));
            }
            function cleanupModifierEffects() {
                effectCleanupFns.forEach((function(fn) {
                    return fn();
                }));
                effectCleanupFns = [];
            }
            return instance;
        };
    }
    null && popperGenerator();
    var passive = {
        passive: true
    };
    function effect(_ref) {
        var state = _ref.state, instance = _ref.instance, options = _ref.options;
        var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
        var window = getWindow_getWindow(state.elements.popper);
        var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
        if (scroll) scrollParents.forEach((function(scrollParent) {
            scrollParent.addEventListener("scroll", instance.update, passive);
        }));
        if (resize) window.addEventListener("resize", instance.update, passive);
        return function() {
            if (scroll) scrollParents.forEach((function(scrollParent) {
                scrollParent.removeEventListener("scroll", instance.update, passive);
            }));
            if (resize) window.removeEventListener("resize", instance.update, passive);
        };
    }
    const eventListeners = {
        name: "eventListeners",
        enabled: true,
        phase: "write",
        fn: function fn() {},
        effect,
        data: {}
    };
    function getBasePlacement(placement) {
        return placement.split("-")[0];
    }
    function getVariation(placement) {
        return placement.split("-")[1];
    }
    function getMainAxisFromPlacement(placement) {
        return [ "top", "bottom" ].indexOf(placement) >= 0 ? "x" : "y";
    }
    function computeOffsets(_ref) {
        var reference = _ref.reference, element = _ref.element, placement = _ref.placement;
        var basePlacement = placement ? getBasePlacement(placement) : null;
        var variation = placement ? getVariation(placement) : null;
        var commonX = reference.x + reference.width / 2 - element.width / 2;
        var commonY = reference.y + reference.height / 2 - element.height / 2;
        var offsets;
        switch (basePlacement) {
          case enums_top:
            offsets = {
                x: commonX,
                y: reference.y - element.height
            };
            break;

          case bottom:
            offsets = {
                x: commonX,
                y: reference.y + reference.height
            };
            break;

          case right:
            offsets = {
                x: reference.x + reference.width,
                y: commonY
            };
            break;

          case left:
            offsets = {
                x: reference.x - element.width,
                y: commonY
            };
            break;

          default:
            offsets = {
                x: reference.x,
                y: reference.y
            };
        }
        var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
        if (mainAxis != null) {
            var len = mainAxis === "y" ? "height" : "width";
            switch (variation) {
              case start:
                offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
                break;

              case end:
                offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
                break;

              default:
            }
        }
        return offsets;
    }
    function popperOffsets(_ref) {
        var state = _ref.state, name = _ref.name;
        state.modifiersData[name] = computeOffsets({
            reference: state.rects.reference,
            element: state.rects.popper,
            strategy: "absolute",
            placement: state.placement
        });
    }
    const modifiers_popperOffsets = {
        name: "popperOffsets",
        enabled: true,
        phase: "read",
        fn: popperOffsets,
        data: {}
    };
    var unsetSides = {
        top: "auto",
        right: "auto",
        bottom: "auto",
        left: "auto"
    };
    function roundOffsetsByDPR(_ref, win) {
        var x = _ref.x, y = _ref.y;
        var dpr = win.devicePixelRatio || 1;
        return {
            x: round(x * dpr) / dpr || 0,
            y: round(y * dpr) / dpr || 0
        };
    }
    function mapToStyles(_ref2) {
        var _Object$assign2;
        var popper = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
        var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
        var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
            x,
            y
        }) : {
            x,
            y
        };
        x = _ref3.x;
        y = _ref3.y;
        var hasX = offsets.hasOwnProperty("x");
        var hasY = offsets.hasOwnProperty("y");
        var sideX = left;
        var sideY = enums_top;
        var win = window;
        if (adaptive) {
            var offsetParent = getOffsetParent(popper);
            var heightProp = "clientHeight";
            var widthProp = "clientWidth";
            if (offsetParent === getWindow_getWindow(popper)) {
                offsetParent = getDocumentElement(popper);
                if (getComputedStyle_getComputedStyle(offsetParent).position !== "static" && position === "absolute") {
                    heightProp = "scrollHeight";
                    widthProp = "scrollWidth";
                }
            }
            offsetParent;
            if (placement === enums_top || (placement === left || placement === right) && variation === end) {
                sideY = bottom;
                var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : offsetParent[heightProp];
                y -= offsetY - popperRect.height;
                y *= gpuAcceleration ? 1 : -1;
            }
            if (placement === left || (placement === enums_top || placement === bottom) && variation === end) {
                sideX = right;
                var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : offsetParent[widthProp];
                x -= offsetX - popperRect.width;
                x *= gpuAcceleration ? 1 : -1;
            }
        }
        var commonStyles = Object.assign({
            position
        }, adaptive && unsetSides);
        var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
            x,
            y
        }, getWindow_getWindow(popper)) : {
            x,
            y
        };
        x = _ref4.x;
        y = _ref4.y;
        if (gpuAcceleration) {
            var _Object$assign;
            return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", 
            _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", 
            _Object$assign));
        }
        return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", 
        _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
    }
    function computeStyles(_ref5) {
        var state = _ref5.state, options = _ref5.options;
        var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
        var commonStyles = {
            placement: getBasePlacement(state.placement),
            variation: getVariation(state.placement),
            popper: state.elements.popper,
            popperRect: state.rects.popper,
            gpuAcceleration,
            isFixed: state.options.strategy === "fixed"
        };
        if (state.modifiersData.popperOffsets != null) state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
            offsets: state.modifiersData.popperOffsets,
            position: state.options.strategy,
            adaptive,
            roundOffsets
        })));
        if (state.modifiersData.arrow != null) state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
            offsets: state.modifiersData.arrow,
            position: "absolute",
            adaptive: false,
            roundOffsets
        })));
        state.attributes.popper = Object.assign({}, state.attributes.popper, {
            "data-popper-placement": state.placement
        });
    }
    const modifiers_computeStyles = {
        name: "computeStyles",
        enabled: true,
        phase: "beforeWrite",
        fn: computeStyles,
        data: {}
    };
    function applyStyles(_ref) {
        var state = _ref.state;
        Object.keys(state.elements).forEach((function(name) {
            var style = state.styles[name] || {};
            var attributes = state.attributes[name] || {};
            var element = state.elements[name];
            if (!isHTMLElement(element) || !getNodeName(element)) return;
            Object.assign(element.style, style);
            Object.keys(attributes).forEach((function(name) {
                var value = attributes[name];
                if (value === false) element.removeAttribute(name); else element.setAttribute(name, value === true ? "" : value);
            }));
        }));
    }
    function applyStyles_effect(_ref2) {
        var state = _ref2.state;
        var initialStyles = {
            popper: {
                position: state.options.strategy,
                left: "0",
                top: "0",
                margin: "0"
            },
            arrow: {
                position: "absolute"
            },
            reference: {}
        };
        Object.assign(state.elements.popper.style, initialStyles.popper);
        state.styles = initialStyles;
        if (state.elements.arrow) Object.assign(state.elements.arrow.style, initialStyles.arrow);
        return function() {
            Object.keys(state.elements).forEach((function(name) {
                var element = state.elements[name];
                var attributes = state.attributes[name] || {};
                var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
                var style = styleProperties.reduce((function(style, property) {
                    style[property] = "";
                    return style;
                }), {});
                if (!isHTMLElement(element) || !getNodeName(element)) return;
                Object.assign(element.style, style);
                Object.keys(attributes).forEach((function(attribute) {
                    element.removeAttribute(attribute);
                }));
            }));
        };
    }
    const modifiers_applyStyles = {
        name: "applyStyles",
        enabled: true,
        phase: "write",
        fn: applyStyles,
        effect: applyStyles_effect,
        requires: [ "computeStyles" ]
    };
    function distanceAndSkiddingToXY(placement, rects, offset) {
        var basePlacement = getBasePlacement(placement);
        var invertDistance = [ left, enums_top ].indexOf(basePlacement) >= 0 ? -1 : 1;
        var _ref = typeof offset === "function" ? offset(Object.assign({}, rects, {
            placement
        })) : offset, skidding = _ref[0], distance = _ref[1];
        skidding = skidding || 0;
        distance = (distance || 0) * invertDistance;
        return [ left, right ].indexOf(basePlacement) >= 0 ? {
            x: distance,
            y: skidding
        } : {
            x: skidding,
            y: distance
        };
    }
    function offset(_ref2) {
        var state = _ref2.state, options = _ref2.options, name = _ref2.name;
        var _options$offset = options.offset, offset = _options$offset === void 0 ? [ 0, 0 ] : _options$offset;
        var data = enums_placements.reduce((function(acc, placement) {
            acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
            return acc;
        }), {});
        var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
        if (state.modifiersData.popperOffsets != null) {
            state.modifiersData.popperOffsets.x += x;
            state.modifiersData.popperOffsets.y += y;
        }
        state.modifiersData[name] = data;
    }
    const modifiers_offset = {
        name: "offset",
        enabled: true,
        phase: "main",
        requires: [ "popperOffsets" ],
        fn: offset
    };
    var hash = {
        left: "right",
        right: "left",
        bottom: "top",
        top: "bottom"
    };
    function getOppositePlacement(placement) {
        return placement.replace(/left|right|bottom|top/g, (function(matched) {
            return hash[matched];
        }));
    }
    var getOppositeVariationPlacement_hash = {
        start: "end",
        end: "start"
    };
    function getOppositeVariationPlacement(placement) {
        return placement.replace(/start|end/g, (function(matched) {
            return getOppositeVariationPlacement_hash[matched];
        }));
    }
    function getViewportRect(element, strategy) {
        var win = getWindow_getWindow(element);
        var html = getDocumentElement(element);
        var visualViewport = win.visualViewport;
        var width = html.clientWidth;
        var height = html.clientHeight;
        var x = 0;
        var y = 0;
        if (visualViewport) {
            width = visualViewport.width;
            height = visualViewport.height;
            var layoutViewport = isLayoutViewport();
            if (layoutViewport || !layoutViewport && strategy === "fixed") {
                x = visualViewport.offsetLeft;
                y = visualViewport.offsetTop;
            }
        }
        return {
            width,
            height,
            x: x + getWindowScrollBarX(element),
            y
        };
    }
    function getDocumentRect(element) {
        var _element$ownerDocumen;
        var html = getDocumentElement(element);
        var winScroll = getWindowScroll(element);
        var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
        var width = math_max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
        var height = math_max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
        var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
        var y = -winScroll.scrollTop;
        if (getComputedStyle_getComputedStyle(body || html).direction === "rtl") x += math_max(html.clientWidth, body ? body.clientWidth : 0) - width;
        return {
            width,
            height,
            x,
            y
        };
    }
    function contains(parent, child) {
        var rootNode = child.getRootNode && child.getRootNode();
        if (parent.contains(child)) return true; else if (rootNode && isShadowRoot(rootNode)) {
            var next = child;
            do {
                if (next && parent.isSameNode(next)) return true;
                next = next.parentNode || next.host;
            } while (next);
        }
        return false;
    }
    function rectToClientRect(rect) {
        return Object.assign({}, rect, {
            left: rect.x,
            top: rect.y,
            right: rect.x + rect.width,
            bottom: rect.y + rect.height
        });
    }
    function getInnerBoundingClientRect(element, strategy) {
        var rect = getBoundingClientRect(element, false, strategy === "fixed");
        rect.top = rect.top + element.clientTop;
        rect.left = rect.left + element.clientLeft;
        rect.bottom = rect.top + element.clientHeight;
        rect.right = rect.left + element.clientWidth;
        rect.width = element.clientWidth;
        rect.height = element.clientHeight;
        rect.x = rect.left;
        rect.y = rect.top;
        return rect;
    }
    function getClientRectFromMixedType(element, clippingParent, strategy) {
        return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
    }
    function getClippingParents(element) {
        var clippingParents = listScrollParents(getParentNode(element));
        var canEscapeClipping = [ "absolute", "fixed" ].indexOf(getComputedStyle_getComputedStyle(element).position) >= 0;
        var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
        if (!isElement(clipperElement)) return [];
        return clippingParents.filter((function(clippingParent) {
            return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
        }));
    }
    function getClippingRect(element, boundary, rootBoundary, strategy) {
        var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
        var clippingParents = [].concat(mainClippingParents, [ rootBoundary ]);
        var firstClippingParent = clippingParents[0];
        var clippingRect = clippingParents.reduce((function(accRect, clippingParent) {
            var rect = getClientRectFromMixedType(element, clippingParent, strategy);
            accRect.top = math_max(rect.top, accRect.top);
            accRect.right = math_min(rect.right, accRect.right);
            accRect.bottom = math_min(rect.bottom, accRect.bottom);
            accRect.left = math_max(rect.left, accRect.left);
            return accRect;
        }), getClientRectFromMixedType(element, firstClippingParent, strategy));
        clippingRect.width = clippingRect.right - clippingRect.left;
        clippingRect.height = clippingRect.bottom - clippingRect.top;
        clippingRect.x = clippingRect.left;
        clippingRect.y = clippingRect.top;
        return clippingRect;
    }
    function getFreshSideObject() {
        return {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
    }
    function mergePaddingObject(paddingObject) {
        return Object.assign({}, getFreshSideObject(), paddingObject);
    }
    function expandToHashMap(value, keys) {
        return keys.reduce((function(hashMap, key) {
            hashMap[key] = value;
            return hashMap;
        }), {});
    }
    function detectOverflow(state, options) {
        if (options === void 0) options = {};
        var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
        var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
        var altContext = elementContext === popper ? reference : popper;
        var popperRect = state.rects.popper;
        var element = state.elements[altBoundary ? altContext : elementContext];
        var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
        var referenceClientRect = getBoundingClientRect(state.elements.reference);
        var popperOffsets = computeOffsets({
            reference: referenceClientRect,
            element: popperRect,
            strategy: "absolute",
            placement
        });
        var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
        var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
        var overflowOffsets = {
            top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
            bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
            left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
            right: elementClientRect.right - clippingClientRect.right + paddingObject.right
        };
        var offsetData = state.modifiersData.offset;
        if (elementContext === popper && offsetData) {
            var offset = offsetData[placement];
            Object.keys(overflowOffsets).forEach((function(key) {
                var multiply = [ right, bottom ].indexOf(key) >= 0 ? 1 : -1;
                var axis = [ enums_top, bottom ].indexOf(key) >= 0 ? "y" : "x";
                overflowOffsets[key] += offset[axis] * multiply;
            }));
        }
        return overflowOffsets;
    }
    function computeAutoPlacement(state, options) {
        if (options === void 0) options = {};
        var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? enums_placements : _options$allowedAutoP;
        var variation = getVariation(placement);
        var placements = variation ? flipVariations ? variationPlacements : variationPlacements.filter((function(placement) {
            return getVariation(placement) === variation;
        })) : basePlacements;
        var allowedPlacements = placements.filter((function(placement) {
            return allowedAutoPlacements.indexOf(placement) >= 0;
        }));
        if (allowedPlacements.length === 0) allowedPlacements = placements;
        var overflows = allowedPlacements.reduce((function(acc, placement) {
            acc[placement] = detectOverflow(state, {
                placement,
                boundary,
                rootBoundary,
                padding
            })[getBasePlacement(placement)];
            return acc;
        }), {});
        return Object.keys(overflows).sort((function(a, b) {
            return overflows[a] - overflows[b];
        }));
    }
    function getExpandedFallbackPlacements(placement) {
        if (getBasePlacement(placement) === auto) return [];
        var oppositePlacement = getOppositePlacement(placement);
        return [ getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement) ];
    }
    function flip(_ref) {
        var state = _ref.state, options = _ref.options, name = _ref.name;
        if (state.modifiersData[name]._skip) return;
        var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
        var preferredPlacement = state.options.placement;
        var basePlacement = getBasePlacement(preferredPlacement);
        var isBasePlacement = basePlacement === preferredPlacement;
        var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [ getOppositePlacement(preferredPlacement) ] : getExpandedFallbackPlacements(preferredPlacement));
        var placements = [ preferredPlacement ].concat(fallbackPlacements).reduce((function(acc, placement) {
            return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
                placement,
                boundary,
                rootBoundary,
                padding,
                flipVariations,
                allowedAutoPlacements
            }) : placement);
        }), []);
        var referenceRect = state.rects.reference;
        var popperRect = state.rects.popper;
        var checksMap = new Map;
        var makeFallbackChecks = true;
        var firstFittingPlacement = placements[0];
        for (var i = 0; i < placements.length; i++) {
            var placement = placements[i];
            var _basePlacement = getBasePlacement(placement);
            var isStartVariation = getVariation(placement) === start;
            var isVertical = [ enums_top, bottom ].indexOf(_basePlacement) >= 0;
            var len = isVertical ? "width" : "height";
            var overflow = detectOverflow(state, {
                placement,
                boundary,
                rootBoundary,
                altBoundary,
                padding
            });
            var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : enums_top;
            if (referenceRect[len] > popperRect[len]) mainVariationSide = getOppositePlacement(mainVariationSide);
            var altVariationSide = getOppositePlacement(mainVariationSide);
            var checks = [];
            if (checkMainAxis) checks.push(overflow[_basePlacement] <= 0);
            if (checkAltAxis) checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
            if (checks.every((function(check) {
                return check;
            }))) {
                firstFittingPlacement = placement;
                makeFallbackChecks = false;
                break;
            }
            checksMap.set(placement, checks);
        }
        if (makeFallbackChecks) {
            var numberOfChecks = flipVariations ? 3 : 1;
            var _loop = function _loop(_i) {
                var fittingPlacement = placements.find((function(placement) {
                    var checks = checksMap.get(placement);
                    if (checks) return checks.slice(0, _i).every((function(check) {
                        return check;
                    }));
                }));
                if (fittingPlacement) {
                    firstFittingPlacement = fittingPlacement;
                    return "break";
                }
            };
            for (var _i = numberOfChecks; _i > 0; _i--) {
                var _ret = _loop(_i);
                if (_ret === "break") break;
            }
        }
        if (state.placement !== firstFittingPlacement) {
            state.modifiersData[name]._skip = true;
            state.placement = firstFittingPlacement;
            state.reset = true;
        }
    }
    const modifiers_flip = {
        name: "flip",
        enabled: true,
        phase: "main",
        fn: flip,
        requiresIfExists: [ "offset" ],
        data: {
            _skip: false
        }
    };
    function getAltAxis(axis) {
        return axis === "x" ? "y" : "x";
    }
    function within(min, value, max) {
        return math_max(min, math_min(value, max));
    }
    function withinMaxClamp(min, value, max) {
        var v = within(min, value, max);
        return v > max ? max : v;
    }
    function preventOverflow(_ref) {
        var state = _ref.state, options = _ref.options, name = _ref.name;
        var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
        var overflow = detectOverflow(state, {
            boundary,
            rootBoundary,
            padding,
            altBoundary
        });
        var basePlacement = getBasePlacement(state.placement);
        var variation = getVariation(state.placement);
        var isBasePlacement = !variation;
        var mainAxis = getMainAxisFromPlacement(basePlacement);
        var altAxis = getAltAxis(mainAxis);
        var popperOffsets = state.modifiersData.popperOffsets;
        var referenceRect = state.rects.reference;
        var popperRect = state.rects.popper;
        var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
            placement: state.placement
        })) : tetherOffset;
        var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
            mainAxis: tetherOffsetValue,
            altAxis: tetherOffsetValue
        } : Object.assign({
            mainAxis: 0,
            altAxis: 0
        }, tetherOffsetValue);
        var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
        var data = {
            x: 0,
            y: 0
        };
        if (!popperOffsets) return;
        if (checkMainAxis) {
            var _offsetModifierState$;
            var mainSide = mainAxis === "y" ? enums_top : left;
            var altSide = mainAxis === "y" ? bottom : right;
            var len = mainAxis === "y" ? "height" : "width";
            var offset = popperOffsets[mainAxis];
            var min = offset + overflow[mainSide];
            var max = offset - overflow[altSide];
            var additive = tether ? -popperRect[len] / 2 : 0;
            var minLen = variation === start ? referenceRect[len] : popperRect[len];
            var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
            var arrowElement = state.elements.arrow;
            var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
                width: 0,
                height: 0
            };
            var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
            var arrowPaddingMin = arrowPaddingObject[mainSide];
            var arrowPaddingMax = arrowPaddingObject[altSide];
            var arrowLen = within(0, referenceRect[len], arrowRect[len]);
            var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
            var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
            var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
            var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
            var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
            var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
            var tetherMax = offset + maxOffset - offsetModifierValue;
            var preventedOffset = within(tether ? math_min(min, tetherMin) : min, offset, tether ? math_max(max, tetherMax) : max);
            popperOffsets[mainAxis] = preventedOffset;
            data[mainAxis] = preventedOffset - offset;
        }
        if (checkAltAxis) {
            var _offsetModifierState$2;
            var _mainSide = mainAxis === "x" ? enums_top : left;
            var _altSide = mainAxis === "x" ? bottom : right;
            var _offset = popperOffsets[altAxis];
            var _len = altAxis === "y" ? "height" : "width";
            var _min = _offset + overflow[_mainSide];
            var _max = _offset - overflow[_altSide];
            var isOriginSide = [ enums_top, left ].indexOf(basePlacement) !== -1;
            var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
            var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
            var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
            var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
            popperOffsets[altAxis] = _preventedOffset;
            data[altAxis] = _preventedOffset - _offset;
        }
        state.modifiersData[name] = data;
    }
    const modifiers_preventOverflow = {
        name: "preventOverflow",
        enabled: true,
        phase: "main",
        fn: preventOverflow,
        requiresIfExists: [ "offset" ]
    };
    var toPaddingObject = function toPaddingObject(padding, state) {
        padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
            placement: state.placement
        })) : padding;
        return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
    };
    function arrow(_ref) {
        var _state$modifiersData$;
        var state = _ref.state, name = _ref.name, options = _ref.options;
        var arrowElement = state.elements.arrow;
        var popperOffsets = state.modifiersData.popperOffsets;
        var basePlacement = getBasePlacement(state.placement);
        var axis = getMainAxisFromPlacement(basePlacement);
        var isVertical = [ left, right ].indexOf(basePlacement) >= 0;
        var len = isVertical ? "height" : "width";
        if (!arrowElement || !popperOffsets) return;
        var paddingObject = toPaddingObject(options.padding, state);
        var arrowRect = getLayoutRect(arrowElement);
        var minProp = axis === "y" ? enums_top : left;
        var maxProp = axis === "y" ? bottom : right;
        var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
        var startDiff = popperOffsets[axis] - state.rects.reference[axis];
        var arrowOffsetParent = getOffsetParent(arrowElement);
        var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
        var centerToReference = endDiff / 2 - startDiff / 2;
        var min = paddingObject[minProp];
        var max = clientSize - arrowRect[len] - paddingObject[maxProp];
        var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
        var offset = within(min, center, max);
        var axisProp = axis;
        state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, 
        _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
    }
    function arrow_effect(_ref2) {
        var state = _ref2.state, options = _ref2.options;
        var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
        if (arrowElement == null) return;
        if (typeof arrowElement === "string") {
            arrowElement = state.elements.popper.querySelector(arrowElement);
            if (!arrowElement) return;
        }
        if (!contains(state.elements.popper, arrowElement)) return;
        state.elements.arrow = arrowElement;
    }
    const modifiers_arrow = {
        name: "arrow",
        enabled: true,
        phase: "main",
        fn: arrow,
        effect: arrow_effect,
        requires: [ "popperOffsets" ],
        requiresIfExists: [ "preventOverflow" ]
    };
    function getSideOffsets(overflow, rect, preventedOffsets) {
        if (preventedOffsets === void 0) preventedOffsets = {
            x: 0,
            y: 0
        };
        return {
            top: overflow.top - rect.height - preventedOffsets.y,
            right: overflow.right - rect.width + preventedOffsets.x,
            bottom: overflow.bottom - rect.height + preventedOffsets.y,
            left: overflow.left - rect.width - preventedOffsets.x
        };
    }
    function isAnySideFullyClipped(overflow) {
        return [ enums_top, right, bottom, left ].some((function(side) {
            return overflow[side] >= 0;
        }));
    }
    function hide(_ref) {
        var state = _ref.state, name = _ref.name;
        var referenceRect = state.rects.reference;
        var popperRect = state.rects.popper;
        var preventedOffsets = state.modifiersData.preventOverflow;
        var referenceOverflow = detectOverflow(state, {
            elementContext: "reference"
        });
        var popperAltOverflow = detectOverflow(state, {
            altBoundary: true
        });
        var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
        var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
        var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
        var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
        state.modifiersData[name] = {
            referenceClippingOffsets,
            popperEscapeOffsets,
            isReferenceHidden,
            hasPopperEscaped
        };
        state.attributes.popper = Object.assign({}, state.attributes.popper, {
            "data-popper-reference-hidden": isReferenceHidden,
            "data-popper-escaped": hasPopperEscaped
        });
    }
    const modifiers_hide = {
        name: "hide",
        enabled: true,
        phase: "main",
        requiresIfExists: [ "preventOverflow" ],
        fn: hide
    };
    var defaultModifiers = [ eventListeners, modifiers_popperOffsets, modifiers_computeStyles, modifiers_applyStyles, modifiers_offset, modifiers_flip, modifiers_preventOverflow, modifiers_arrow, modifiers_hide ];
    var popper_createPopper = popperGenerator({
        defaultModifiers
    });
    var BOX_CLASS = "tippy-box";
    var CONTENT_CLASS = "tippy-content";
    var BACKDROP_CLASS = "tippy-backdrop";
    var ARROW_CLASS = "tippy-arrow";
    var SVG_ARROW_CLASS = "tippy-svg-arrow";
    var TOUCH_OPTIONS = {
        passive: true,
        capture: true
    };
    var TIPPY_DEFAULT_APPEND_TO = function TIPPY_DEFAULT_APPEND_TO() {
        return document.body;
    };
    function getValueAtIndexOrReturn(value, index, defaultValue) {
        if (Array.isArray(value)) {
            var v = value[index];
            return v == null ? Array.isArray(defaultValue) ? defaultValue[index] : defaultValue : v;
        }
        return value;
    }
    function isType(value, type) {
        var str = {}.toString.call(value);
        return str.indexOf("[object") === 0 && str.indexOf(type + "]") > -1;
    }
    function invokeWithArgsOrReturn(value, args) {
        return typeof value === "function" ? value.apply(void 0, args) : value;
    }
    function tippy_esm_debounce(fn, ms) {
        if (ms === 0) return fn;
        var timeout;
        return function(arg) {
            clearTimeout(timeout);
            timeout = setTimeout((function() {
                fn(arg);
            }), ms);
        };
    }
    function splitBySpaces(value) {
        return value.split(/\s+/).filter(Boolean);
    }
    function normalizeToArray(value) {
        return [].concat(value);
    }
    function pushIfUnique(arr, value) {
        if (arr.indexOf(value) === -1) arr.push(value);
    }
    function unique(arr) {
        return arr.filter((function(item, index) {
            return arr.indexOf(item) === index;
        }));
    }
    function tippy_esm_getBasePlacement(placement) {
        return placement.split("-")[0];
    }
    function arrayFrom(value) {
        return [].slice.call(value);
    }
    function removeUndefinedProps(obj) {
        return Object.keys(obj).reduce((function(acc, key) {
            if (obj[key] !== void 0) acc[key] = obj[key];
            return acc;
        }), {});
    }
    function div() {
        return document.createElement("div");
    }
    function tippy_esm_isElement(value) {
        return [ "Element", "Fragment" ].some((function(type) {
            return isType(value, type);
        }));
    }
    function isNodeList(value) {
        return isType(value, "NodeList");
    }
    function isMouseEvent(value) {
        return isType(value, "MouseEvent");
    }
    function isReferenceElement(value) {
        return !!(value && value._tippy && value._tippy.reference === value);
    }
    function getArrayOfElements(value) {
        if (tippy_esm_isElement(value)) return [ value ];
        if (isNodeList(value)) return arrayFrom(value);
        if (Array.isArray(value)) return value;
        return arrayFrom(document.querySelectorAll(value));
    }
    function setTransitionDuration(els, value) {
        els.forEach((function(el) {
            if (el) el.style.transitionDuration = value + "ms";
        }));
    }
    function setVisibilityState(els, state) {
        els.forEach((function(el) {
            if (el) el.setAttribute("data-state", state);
        }));
    }
    function getOwnerDocument(elementOrElements) {
        var _element$ownerDocumen;
        var _normalizeToArray = normalizeToArray(elementOrElements), element = _normalizeToArray[0];
        return element != null && (_element$ownerDocumen = element.ownerDocument) != null && _element$ownerDocumen.body ? element.ownerDocument : document;
    }
    function isCursorOutsideInteractiveBorder(popperTreeData, event) {
        var clientX = event.clientX, clientY = event.clientY;
        return popperTreeData.every((function(_ref) {
            var popperRect = _ref.popperRect, popperState = _ref.popperState, props = _ref.props;
            var interactiveBorder = props.interactiveBorder;
            var basePlacement = tippy_esm_getBasePlacement(popperState.placement);
            var offsetData = popperState.modifiersData.offset;
            if (!offsetData) return true;
            var topDistance = basePlacement === "bottom" ? offsetData.top.y : 0;
            var bottomDistance = basePlacement === "top" ? offsetData.bottom.y : 0;
            var leftDistance = basePlacement === "right" ? offsetData.left.x : 0;
            var rightDistance = basePlacement === "left" ? offsetData.right.x : 0;
            var exceedsTop = popperRect.top - clientY + topDistance > interactiveBorder;
            var exceedsBottom = clientY - popperRect.bottom - bottomDistance > interactiveBorder;
            var exceedsLeft = popperRect.left - clientX + leftDistance > interactiveBorder;
            var exceedsRight = clientX - popperRect.right - rightDistance > interactiveBorder;
            return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
        }));
    }
    function updateTransitionEndListener(box, action, listener) {
        var method = action + "EventListener";
        [ "transitionend", "webkitTransitionEnd" ].forEach((function(event) {
            box[method](event, listener);
        }));
    }
    function actualContains(parent, child) {
        var target = child;
        while (target) {
            var _target$getRootNode;
            if (parent.contains(target)) return true;
            target = target.getRootNode == null ? void 0 : (_target$getRootNode = target.getRootNode()) == null ? void 0 : _target$getRootNode.host;
        }
        return false;
    }
    var currentInput = {
        isTouch: false
    };
    var lastMouseMoveTime = 0;
    function onDocumentTouchStart() {
        if (currentInput.isTouch) return;
        currentInput.isTouch = true;
        if (window.performance) document.addEventListener("mousemove", onDocumentMouseMove);
    }
    function onDocumentMouseMove() {
        var now = performance.now();
        if (now - lastMouseMoveTime < 20) {
            currentInput.isTouch = false;
            document.removeEventListener("mousemove", onDocumentMouseMove);
        }
        lastMouseMoveTime = now;
    }
    function onWindowBlur() {
        var activeElement = document.activeElement;
        if (isReferenceElement(activeElement)) {
            var instance = activeElement._tippy;
            if (activeElement.blur && !instance.state.isVisible) activeElement.blur();
        }
    }
    function bindGlobalEventListeners() {
        document.addEventListener("touchstart", onDocumentTouchStart, TOUCH_OPTIONS);
        window.addEventListener("blur", onWindowBlur);
    }
    var isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
    var isIE11 = isBrowser ? !!window.msCrypto : false;
    if (false) ;
    var pluginProps = {
        animateFill: false,
        followCursor: false,
        inlinePositioning: false,
        sticky: false
    };
    var renderProps = {
        allowHTML: false,
        animation: "fade",
        arrow: true,
        content: "",
        inertia: false,
        maxWidth: 350,
        role: "tooltip",
        theme: "",
        zIndex: 9999
    };
    var defaultProps = Object.assign({
        appendTo: TIPPY_DEFAULT_APPEND_TO,
        aria: {
            content: "auto",
            expanded: "auto"
        },
        delay: 0,
        duration: [ 300, 250 ],
        getReferenceClientRect: null,
        hideOnClick: true,
        ignoreAttributes: false,
        interactive: false,
        interactiveBorder: 2,
        interactiveDebounce: 0,
        moveTransition: "",
        offset: [ 0, 10 ],
        onAfterUpdate: function onAfterUpdate() {},
        onBeforeUpdate: function onBeforeUpdate() {},
        onCreate: function onCreate() {},
        onDestroy: function onDestroy() {},
        onHidden: function onHidden() {},
        onHide: function onHide() {},
        onMount: function onMount() {},
        onShow: function onShow() {},
        onShown: function onShown() {},
        onTrigger: function onTrigger() {},
        onUntrigger: function onUntrigger() {},
        onClickOutside: function onClickOutside() {},
        placement: "top",
        plugins: [],
        popperOptions: {},
        render: null,
        showOnCreate: false,
        touch: true,
        trigger: "mouseenter focus",
        triggerTarget: null
    }, pluginProps, renderProps);
    var defaultKeys = Object.keys(defaultProps);
    var setDefaultProps = function setDefaultProps(partialProps) {
        if (false) ;
        var keys = Object.keys(partialProps);
        keys.forEach((function(key) {
            defaultProps[key] = partialProps[key];
        }));
    };
    function getExtendedPassedProps(passedProps) {
        var plugins = passedProps.plugins || [];
        var pluginProps = plugins.reduce((function(acc, plugin) {
            var name = plugin.name, defaultValue = plugin.defaultValue;
            if (name) {
                var _name;
                acc[name] = passedProps[name] !== void 0 ? passedProps[name] : (_name = defaultProps[name]) != null ? _name : defaultValue;
            }
            return acc;
        }), {});
        return Object.assign({}, passedProps, pluginProps);
    }
    function getDataAttributeProps(reference, plugins) {
        var propKeys = plugins ? Object.keys(getExtendedPassedProps(Object.assign({}, defaultProps, {
            plugins
        }))) : defaultKeys;
        var props = propKeys.reduce((function(acc, key) {
            var valueAsString = (reference.getAttribute("data-tippy-" + key) || "").trim();
            if (!valueAsString) return acc;
            if (key === "content") acc[key] = valueAsString; else try {
                acc[key] = JSON.parse(valueAsString);
            } catch (e) {
                acc[key] = valueAsString;
            }
            return acc;
        }), {});
        return props;
    }
    function evaluateProps(reference, props) {
        var out = Object.assign({}, props, {
            content: invokeWithArgsOrReturn(props.content, [ reference ])
        }, props.ignoreAttributes ? {} : getDataAttributeProps(reference, props.plugins));
        out.aria = Object.assign({}, defaultProps.aria, out.aria);
        out.aria = {
            expanded: out.aria.expanded === "auto" ? props.interactive : out.aria.expanded,
            content: out.aria.content === "auto" ? props.interactive ? null : "describedby" : out.aria.content
        };
        return out;
    }
    var innerHTML = function innerHTML() {
        return "innerHTML";
    };
    function dangerouslySetInnerHTML(element, html) {
        element[innerHTML()] = html;
    }
    function createArrowElement(value) {
        var arrow = div();
        if (value === true) arrow.className = ARROW_CLASS; else {
            arrow.className = SVG_ARROW_CLASS;
            if (tippy_esm_isElement(value)) arrow.appendChild(value); else dangerouslySetInnerHTML(arrow, value);
        }
        return arrow;
    }
    function setContent(content, props) {
        if (tippy_esm_isElement(props.content)) {
            dangerouslySetInnerHTML(content, "");
            content.appendChild(props.content);
        } else if (typeof props.content !== "function") if (props.allowHTML) dangerouslySetInnerHTML(content, props.content); else content.textContent = props.content;
    }
    function getChildren(popper) {
        var box = popper.firstElementChild;
        var boxChildren = arrayFrom(box.children);
        return {
            box,
            content: boxChildren.find((function(node) {
                return node.classList.contains(CONTENT_CLASS);
            })),
            arrow: boxChildren.find((function(node) {
                return node.classList.contains(ARROW_CLASS) || node.classList.contains(SVG_ARROW_CLASS);
            })),
            backdrop: boxChildren.find((function(node) {
                return node.classList.contains(BACKDROP_CLASS);
            }))
        };
    }
    function render(instance) {
        var popper = div();
        var box = div();
        box.className = BOX_CLASS;
        box.setAttribute("data-state", "hidden");
        box.setAttribute("tabindex", "-1");
        var content = div();
        content.className = CONTENT_CLASS;
        content.setAttribute("data-state", "hidden");
        setContent(content, instance.props);
        popper.appendChild(box);
        box.appendChild(content);
        onUpdate(instance.props, instance.props);
        function onUpdate(prevProps, nextProps) {
            var _getChildren = getChildren(popper), box = _getChildren.box, content = _getChildren.content, arrow = _getChildren.arrow;
            if (nextProps.theme) box.setAttribute("data-theme", nextProps.theme); else box.removeAttribute("data-theme");
            if (typeof nextProps.animation === "string") box.setAttribute("data-animation", nextProps.animation); else box.removeAttribute("data-animation");
            if (nextProps.inertia) box.setAttribute("data-inertia", ""); else box.removeAttribute("data-inertia");
            box.style.maxWidth = typeof nextProps.maxWidth === "number" ? nextProps.maxWidth + "px" : nextProps.maxWidth;
            if (nextProps.role) box.setAttribute("role", nextProps.role); else box.removeAttribute("role");
            if (prevProps.content !== nextProps.content || prevProps.allowHTML !== nextProps.allowHTML) setContent(content, instance.props);
            if (nextProps.arrow) {
                if (!arrow) box.appendChild(createArrowElement(nextProps.arrow)); else if (prevProps.arrow !== nextProps.arrow) {
                    box.removeChild(arrow);
                    box.appendChild(createArrowElement(nextProps.arrow));
                }
            } else if (arrow) box.removeChild(arrow);
        }
        return {
            popper,
            onUpdate
        };
    }
    render.$$tippy = true;
    var idCounter = 1;
    var mouseMoveListeners = [];
    var mountedInstances = [];
    function createTippy(reference, passedProps) {
        var props = evaluateProps(reference, Object.assign({}, defaultProps, getExtendedPassedProps(removeUndefinedProps(passedProps))));
        var showTimeout;
        var hideTimeout;
        var scheduleHideAnimationFrame;
        var isVisibleFromClick = false;
        var didHideDueToDocumentMouseDown = false;
        var didTouchMove = false;
        var ignoreOnFirstUpdate = false;
        var lastTriggerEvent;
        var currentTransitionEndListener;
        var onFirstUpdate;
        var listeners = [];
        var debouncedOnMouseMove = tippy_esm_debounce(onMouseMove, props.interactiveDebounce);
        var currentTarget;
        var id = idCounter++;
        var popperInstance = null;
        var plugins = unique(props.plugins);
        var state = {
            isEnabled: true,
            isVisible: false,
            isDestroyed: false,
            isMounted: false,
            isShown: false
        };
        var instance = {
            id,
            reference,
            popper: div(),
            popperInstance,
            props,
            state,
            plugins,
            clearDelayTimeouts,
            setProps,
            setContent,
            show,
            hide,
            hideWithInteractivity,
            enable,
            disable,
            unmount,
            destroy
        };
        if (!props.render) {
            if (false) ;
            return instance;
        }
        var _props$render = props.render(instance), popper = _props$render.popper, onUpdate = _props$render.onUpdate;
        popper.setAttribute("data-tippy-root", "");
        popper.id = "tippy-" + instance.id;
        instance.popper = popper;
        reference._tippy = instance;
        popper._tippy = instance;
        var pluginsHooks = plugins.map((function(plugin) {
            return plugin.fn(instance);
        }));
        var hasAriaExpanded = reference.hasAttribute("aria-expanded");
        addListeners();
        handleAriaExpandedAttribute();
        handleStyles();
        invokeHook("onCreate", [ instance ]);
        if (props.showOnCreate) scheduleShow();
        popper.addEventListener("mouseenter", (function() {
            if (instance.props.interactive && instance.state.isVisible) instance.clearDelayTimeouts();
        }));
        popper.addEventListener("mouseleave", (function() {
            if (instance.props.interactive && instance.props.trigger.indexOf("mouseenter") >= 0) getDocument().addEventListener("mousemove", debouncedOnMouseMove);
        }));
        return instance;
        function getNormalizedTouchSettings() {
            var touch = instance.props.touch;
            return Array.isArray(touch) ? touch : [ touch, 0 ];
        }
        function getIsCustomTouchBehavior() {
            return getNormalizedTouchSettings()[0] === "hold";
        }
        function getIsDefaultRenderFn() {
            var _instance$props$rende;
            return !!((_instance$props$rende = instance.props.render) != null && _instance$props$rende.$$tippy);
        }
        function getCurrentTarget() {
            return currentTarget || reference;
        }
        function getDocument() {
            var parent = getCurrentTarget().parentNode;
            return parent ? getOwnerDocument(parent) : document;
        }
        function getDefaultTemplateChildren() {
            return getChildren(popper);
        }
        function getDelay(isShow) {
            if (instance.state.isMounted && !instance.state.isVisible || currentInput.isTouch || lastTriggerEvent && lastTriggerEvent.type === "focus") return 0;
            return getValueAtIndexOrReturn(instance.props.delay, isShow ? 0 : 1, defaultProps.delay);
        }
        function handleStyles(fromHide) {
            if (fromHide === void 0) fromHide = false;
            popper.style.pointerEvents = instance.props.interactive && !fromHide ? "" : "none";
            popper.style.zIndex = "" + instance.props.zIndex;
        }
        function invokeHook(hook, args, shouldInvokePropsHook) {
            if (shouldInvokePropsHook === void 0) shouldInvokePropsHook = true;
            pluginsHooks.forEach((function(pluginHooks) {
                if (pluginHooks[hook]) pluginHooks[hook].apply(pluginHooks, args);
            }));
            if (shouldInvokePropsHook) {
                var _instance$props;
                (_instance$props = instance.props)[hook].apply(_instance$props, args);
            }
        }
        function handleAriaContentAttribute() {
            var aria = instance.props.aria;
            if (!aria.content) return;
            var attr = "aria-" + aria.content;
            var id = popper.id;
            var nodes = normalizeToArray(instance.props.triggerTarget || reference);
            nodes.forEach((function(node) {
                var currentValue = node.getAttribute(attr);
                if (instance.state.isVisible) node.setAttribute(attr, currentValue ? currentValue + " " + id : id); else {
                    var nextValue = currentValue && currentValue.replace(id, "").trim();
                    if (nextValue) node.setAttribute(attr, nextValue); else node.removeAttribute(attr);
                }
            }));
        }
        function handleAriaExpandedAttribute() {
            if (hasAriaExpanded || !instance.props.aria.expanded) return;
            var nodes = normalizeToArray(instance.props.triggerTarget || reference);
            nodes.forEach((function(node) {
                if (instance.props.interactive) node.setAttribute("aria-expanded", instance.state.isVisible && node === getCurrentTarget() ? "true" : "false"); else node.removeAttribute("aria-expanded");
            }));
        }
        function cleanupInteractiveMouseListeners() {
            getDocument().removeEventListener("mousemove", debouncedOnMouseMove);
            mouseMoveListeners = mouseMoveListeners.filter((function(listener) {
                return listener !== debouncedOnMouseMove;
            }));
        }
        function onDocumentPress(event) {
            if (currentInput.isTouch) if (didTouchMove || event.type === "mousedown") return;
            var actualTarget = event.composedPath && event.composedPath()[0] || event.target;
            if (instance.props.interactive && actualContains(popper, actualTarget)) return;
            if (normalizeToArray(instance.props.triggerTarget || reference).some((function(el) {
                return actualContains(el, actualTarget);
            }))) {
                if (currentInput.isTouch) return;
                if (instance.state.isVisible && instance.props.trigger.indexOf("click") >= 0) return;
            } else invokeHook("onClickOutside", [ instance, event ]);
            if (instance.props.hideOnClick === true) {
                instance.clearDelayTimeouts();
                instance.hide();
                didHideDueToDocumentMouseDown = true;
                setTimeout((function() {
                    didHideDueToDocumentMouseDown = false;
                }));
                if (!instance.state.isMounted) removeDocumentPress();
            }
        }
        function onTouchMove() {
            didTouchMove = true;
        }
        function onTouchStart() {
            didTouchMove = false;
        }
        function addDocumentPress() {
            var doc = getDocument();
            doc.addEventListener("mousedown", onDocumentPress, true);
            doc.addEventListener("touchend", onDocumentPress, TOUCH_OPTIONS);
            doc.addEventListener("touchstart", onTouchStart, TOUCH_OPTIONS);
            doc.addEventListener("touchmove", onTouchMove, TOUCH_OPTIONS);
        }
        function removeDocumentPress() {
            var doc = getDocument();
            doc.removeEventListener("mousedown", onDocumentPress, true);
            doc.removeEventListener("touchend", onDocumentPress, TOUCH_OPTIONS);
            doc.removeEventListener("touchstart", onTouchStart, TOUCH_OPTIONS);
            doc.removeEventListener("touchmove", onTouchMove, TOUCH_OPTIONS);
        }
        function onTransitionedOut(duration, callback) {
            onTransitionEnd(duration, (function() {
                if (!instance.state.isVisible && popper.parentNode && popper.parentNode.contains(popper)) callback();
            }));
        }
        function onTransitionedIn(duration, callback) {
            onTransitionEnd(duration, callback);
        }
        function onTransitionEnd(duration, callback) {
            var box = getDefaultTemplateChildren().box;
            function listener(event) {
                if (event.target === box) {
                    updateTransitionEndListener(box, "remove", listener);
                    callback();
                }
            }
            if (duration === 0) return callback();
            updateTransitionEndListener(box, "remove", currentTransitionEndListener);
            updateTransitionEndListener(box, "add", listener);
            currentTransitionEndListener = listener;
        }
        function on(eventType, handler, options) {
            if (options === void 0) options = false;
            var nodes = normalizeToArray(instance.props.triggerTarget || reference);
            nodes.forEach((function(node) {
                node.addEventListener(eventType, handler, options);
                listeners.push({
                    node,
                    eventType,
                    handler,
                    options
                });
            }));
        }
        function addListeners() {
            if (getIsCustomTouchBehavior()) {
                on("touchstart", onTrigger, {
                    passive: true
                });
                on("touchend", onMouseLeave, {
                    passive: true
                });
            }
            splitBySpaces(instance.props.trigger).forEach((function(eventType) {
                if (eventType === "manual") return;
                on(eventType, onTrigger);
                switch (eventType) {
                  case "mouseenter":
                    on("mouseleave", onMouseLeave);
                    break;

                  case "focus":
                    on(isIE11 ? "focusout" : "blur", onBlurOrFocusOut);
                    break;

                  case "focusin":
                    on("focusout", onBlurOrFocusOut);
                    break;
                }
            }));
        }
        function removeListeners() {
            listeners.forEach((function(_ref) {
                var node = _ref.node, eventType = _ref.eventType, handler = _ref.handler, options = _ref.options;
                node.removeEventListener(eventType, handler, options);
            }));
            listeners = [];
        }
        function onTrigger(event) {
            var _lastTriggerEvent;
            var shouldScheduleClickHide = false;
            if (!instance.state.isEnabled || isEventListenerStopped(event) || didHideDueToDocumentMouseDown) return;
            var wasFocused = ((_lastTriggerEvent = lastTriggerEvent) == null ? void 0 : _lastTriggerEvent.type) === "focus";
            lastTriggerEvent = event;
            currentTarget = event.currentTarget;
            handleAriaExpandedAttribute();
            if (!instance.state.isVisible && isMouseEvent(event)) mouseMoveListeners.forEach((function(listener) {
                return listener(event);
            }));
            if (event.type === "click" && (instance.props.trigger.indexOf("mouseenter") < 0 || isVisibleFromClick) && instance.props.hideOnClick !== false && instance.state.isVisible) shouldScheduleClickHide = true; else scheduleShow(event);
            if (event.type === "click") isVisibleFromClick = !shouldScheduleClickHide;
            if (shouldScheduleClickHide && !wasFocused) scheduleHide(event);
        }
        function onMouseMove(event) {
            var target = event.target;
            var isCursorOverReferenceOrPopper = getCurrentTarget().contains(target) || popper.contains(target);
            if (event.type === "mousemove" && isCursorOverReferenceOrPopper) return;
            var popperTreeData = getNestedPopperTree().concat(popper).map((function(popper) {
                var _instance$popperInsta;
                var instance = popper._tippy;
                var state = (_instance$popperInsta = instance.popperInstance) == null ? void 0 : _instance$popperInsta.state;
                if (state) return {
                    popperRect: popper.getBoundingClientRect(),
                    popperState: state,
                    props
                };
                return null;
            })).filter(Boolean);
            if (isCursorOutsideInteractiveBorder(popperTreeData, event)) {
                cleanupInteractiveMouseListeners();
                scheduleHide(event);
            }
        }
        function onMouseLeave(event) {
            var shouldBail = isEventListenerStopped(event) || instance.props.trigger.indexOf("click") >= 0 && isVisibleFromClick;
            if (shouldBail) return;
            if (instance.props.interactive) {
                instance.hideWithInteractivity(event);
                return;
            }
            scheduleHide(event);
        }
        function onBlurOrFocusOut(event) {
            if (instance.props.trigger.indexOf("focusin") < 0 && event.target !== getCurrentTarget()) return;
            if (instance.props.interactive && event.relatedTarget && popper.contains(event.relatedTarget)) return;
            scheduleHide(event);
        }
        function isEventListenerStopped(event) {
            return currentInput.isTouch ? getIsCustomTouchBehavior() !== event.type.indexOf("touch") >= 0 : false;
        }
        function createPopperInstance() {
            destroyPopperInstance();
            var _instance$props2 = instance.props, popperOptions = _instance$props2.popperOptions, placement = _instance$props2.placement, offset = _instance$props2.offset, getReferenceClientRect = _instance$props2.getReferenceClientRect, moveTransition = _instance$props2.moveTransition;
            var arrow = getIsDefaultRenderFn() ? getChildren(popper).arrow : null;
            var computedReference = getReferenceClientRect ? {
                getBoundingClientRect: getReferenceClientRect,
                contextElement: getReferenceClientRect.contextElement || getCurrentTarget()
            } : reference;
            var tippyModifier = {
                name: "$$tippy",
                enabled: true,
                phase: "beforeWrite",
                requires: [ "computeStyles" ],
                fn: function fn(_ref2) {
                    var state = _ref2.state;
                    if (getIsDefaultRenderFn()) {
                        var _getDefaultTemplateCh = getDefaultTemplateChildren(), box = _getDefaultTemplateCh.box;
                        [ "placement", "reference-hidden", "escaped" ].forEach((function(attr) {
                            if (attr === "placement") box.setAttribute("data-placement", state.placement); else if (state.attributes.popper["data-popper-" + attr]) box.setAttribute("data-" + attr, ""); else box.removeAttribute("data-" + attr);
                        }));
                        state.attributes.popper = {};
                    }
                }
            };
            var modifiers = [ {
                name: "offset",
                options: {
                    offset
                }
            }, {
                name: "preventOverflow",
                options: {
                    padding: {
                        top: 2,
                        bottom: 2,
                        left: 5,
                        right: 5
                    }
                }
            }, {
                name: "flip",
                options: {
                    padding: 5
                }
            }, {
                name: "computeStyles",
                options: {
                    adaptive: !moveTransition
                }
            }, tippyModifier ];
            if (getIsDefaultRenderFn() && arrow) modifiers.push({
                name: "arrow",
                options: {
                    element: arrow,
                    padding: 3
                }
            });
            modifiers.push.apply(modifiers, (popperOptions == null ? void 0 : popperOptions.modifiers) || []);
            instance.popperInstance = popper_createPopper(computedReference, popper, Object.assign({}, popperOptions, {
                placement,
                onFirstUpdate,
                modifiers
            }));
        }
        function destroyPopperInstance() {
            if (instance.popperInstance) {
                instance.popperInstance.destroy();
                instance.popperInstance = null;
            }
        }
        function mount() {
            var appendTo = instance.props.appendTo;
            var parentNode;
            var node = getCurrentTarget();
            if (instance.props.interactive && appendTo === TIPPY_DEFAULT_APPEND_TO || appendTo === "parent") parentNode = node.parentNode; else parentNode = invokeWithArgsOrReturn(appendTo, [ node ]);
            if (!parentNode.contains(popper)) parentNode.appendChild(popper);
            instance.state.isMounted = true;
            createPopperInstance();
            if (false) ;
        }
        function getNestedPopperTree() {
            return arrayFrom(popper.querySelectorAll("[data-tippy-root]"));
        }
        function scheduleShow(event) {
            instance.clearDelayTimeouts();
            if (event) invokeHook("onTrigger", [ instance, event ]);
            addDocumentPress();
            var delay = getDelay(true);
            var _getNormalizedTouchSe = getNormalizedTouchSettings(), touchValue = _getNormalizedTouchSe[0], touchDelay = _getNormalizedTouchSe[1];
            if (currentInput.isTouch && touchValue === "hold" && touchDelay) delay = touchDelay;
            if (delay) showTimeout = setTimeout((function() {
                instance.show();
            }), delay); else instance.show();
        }
        function scheduleHide(event) {
            instance.clearDelayTimeouts();
            invokeHook("onUntrigger", [ instance, event ]);
            if (!instance.state.isVisible) {
                removeDocumentPress();
                return;
            }
            if (instance.props.trigger.indexOf("mouseenter") >= 0 && instance.props.trigger.indexOf("click") >= 0 && [ "mouseleave", "mousemove" ].indexOf(event.type) >= 0 && isVisibleFromClick) return;
            var delay = getDelay(false);
            if (delay) hideTimeout = setTimeout((function() {
                if (instance.state.isVisible) instance.hide();
            }), delay); else scheduleHideAnimationFrame = requestAnimationFrame((function() {
                instance.hide();
            }));
        }
        function enable() {
            instance.state.isEnabled = true;
        }
        function disable() {
            instance.hide();
            instance.state.isEnabled = false;
        }
        function clearDelayTimeouts() {
            clearTimeout(showTimeout);
            clearTimeout(hideTimeout);
            cancelAnimationFrame(scheduleHideAnimationFrame);
        }
        function setProps(partialProps) {
            if (false) ;
            if (instance.state.isDestroyed) return;
            invokeHook("onBeforeUpdate", [ instance, partialProps ]);
            removeListeners();
            var prevProps = instance.props;
            var nextProps = evaluateProps(reference, Object.assign({}, prevProps, removeUndefinedProps(partialProps), {
                ignoreAttributes: true
            }));
            instance.props = nextProps;
            addListeners();
            if (prevProps.interactiveDebounce !== nextProps.interactiveDebounce) {
                cleanupInteractiveMouseListeners();
                debouncedOnMouseMove = tippy_esm_debounce(onMouseMove, nextProps.interactiveDebounce);
            }
            if (prevProps.triggerTarget && !nextProps.triggerTarget) normalizeToArray(prevProps.triggerTarget).forEach((function(node) {
                node.removeAttribute("aria-expanded");
            })); else if (nextProps.triggerTarget) reference.removeAttribute("aria-expanded");
            handleAriaExpandedAttribute();
            handleStyles();
            if (onUpdate) onUpdate(prevProps, nextProps);
            if (instance.popperInstance) {
                createPopperInstance();
                getNestedPopperTree().forEach((function(nestedPopper) {
                    requestAnimationFrame(nestedPopper._tippy.popperInstance.forceUpdate);
                }));
            }
            invokeHook("onAfterUpdate", [ instance, partialProps ]);
        }
        function setContent(content) {
            instance.setProps({
                content
            });
        }
        function show() {
            if (false) ;
            var isAlreadyVisible = instance.state.isVisible;
            var isDestroyed = instance.state.isDestroyed;
            var isDisabled = !instance.state.isEnabled;
            var isTouchAndTouchDisabled = currentInput.isTouch && !instance.props.touch;
            var duration = getValueAtIndexOrReturn(instance.props.duration, 0, defaultProps.duration);
            if (isAlreadyVisible || isDestroyed || isDisabled || isTouchAndTouchDisabled) return;
            if (getCurrentTarget().hasAttribute("disabled")) return;
            invokeHook("onShow", [ instance ], false);
            if (instance.props.onShow(instance) === false) return;
            instance.state.isVisible = true;
            if (getIsDefaultRenderFn()) popper.style.visibility = "visible";
            handleStyles();
            addDocumentPress();
            if (!instance.state.isMounted) popper.style.transition = "none";
            if (getIsDefaultRenderFn()) {
                var _getDefaultTemplateCh2 = getDefaultTemplateChildren(), box = _getDefaultTemplateCh2.box, content = _getDefaultTemplateCh2.content;
                setTransitionDuration([ box, content ], 0);
            }
            onFirstUpdate = function onFirstUpdate() {
                var _instance$popperInsta2;
                if (!instance.state.isVisible || ignoreOnFirstUpdate) return;
                ignoreOnFirstUpdate = true;
                void popper.offsetHeight;
                popper.style.transition = instance.props.moveTransition;
                if (getIsDefaultRenderFn() && instance.props.animation) {
                    var _getDefaultTemplateCh3 = getDefaultTemplateChildren(), _box = _getDefaultTemplateCh3.box, _content = _getDefaultTemplateCh3.content;
                    setTransitionDuration([ _box, _content ], duration);
                    setVisibilityState([ _box, _content ], "visible");
                }
                handleAriaContentAttribute();
                handleAriaExpandedAttribute();
                pushIfUnique(mountedInstances, instance);
                (_instance$popperInsta2 = instance.popperInstance) == null ? void 0 : _instance$popperInsta2.forceUpdate();
                invokeHook("onMount", [ instance ]);
                if (instance.props.animation && getIsDefaultRenderFn()) onTransitionedIn(duration, (function() {
                    instance.state.isShown = true;
                    invokeHook("onShown", [ instance ]);
                }));
            };
            mount();
        }
        function hide() {
            if (false) ;
            var isAlreadyHidden = !instance.state.isVisible;
            var isDestroyed = instance.state.isDestroyed;
            var isDisabled = !instance.state.isEnabled;
            var duration = getValueAtIndexOrReturn(instance.props.duration, 1, defaultProps.duration);
            if (isAlreadyHidden || isDestroyed || isDisabled) return;
            invokeHook("onHide", [ instance ], false);
            if (instance.props.onHide(instance) === false) return;
            instance.state.isVisible = false;
            instance.state.isShown = false;
            ignoreOnFirstUpdate = false;
            isVisibleFromClick = false;
            if (getIsDefaultRenderFn()) popper.style.visibility = "hidden";
            cleanupInteractiveMouseListeners();
            removeDocumentPress();
            handleStyles(true);
            if (getIsDefaultRenderFn()) {
                var _getDefaultTemplateCh4 = getDefaultTemplateChildren(), box = _getDefaultTemplateCh4.box, content = _getDefaultTemplateCh4.content;
                if (instance.props.animation) {
                    setTransitionDuration([ box, content ], duration);
                    setVisibilityState([ box, content ], "hidden");
                }
            }
            handleAriaContentAttribute();
            handleAriaExpandedAttribute();
            if (instance.props.animation) {
                if (getIsDefaultRenderFn()) onTransitionedOut(duration, instance.unmount);
            } else instance.unmount();
        }
        function hideWithInteractivity(event) {
            if (false) ;
            getDocument().addEventListener("mousemove", debouncedOnMouseMove);
            pushIfUnique(mouseMoveListeners, debouncedOnMouseMove);
            debouncedOnMouseMove(event);
        }
        function unmount() {
            if (false) ;
            if (instance.state.isVisible) instance.hide();
            if (!instance.state.isMounted) return;
            destroyPopperInstance();
            getNestedPopperTree().forEach((function(nestedPopper) {
                nestedPopper._tippy.unmount();
            }));
            if (popper.parentNode) popper.parentNode.removeChild(popper);
            mountedInstances = mountedInstances.filter((function(i) {
                return i !== instance;
            }));
            instance.state.isMounted = false;
            invokeHook("onHidden", [ instance ]);
        }
        function destroy() {
            if (false) ;
            if (instance.state.isDestroyed) return;
            instance.clearDelayTimeouts();
            instance.unmount();
            removeListeners();
            delete reference._tippy;
            instance.state.isDestroyed = true;
            invokeHook("onDestroy", [ instance ]);
        }
    }
    function tippy(targets, optionalProps) {
        if (optionalProps === void 0) optionalProps = {};
        var plugins = defaultProps.plugins.concat(optionalProps.plugins || []);
        if (false) ;
        bindGlobalEventListeners();
        var passedProps = Object.assign({}, optionalProps, {
            plugins
        });
        var elements = getArrayOfElements(targets);
        if (false) ;
        var instances = elements.reduce((function(acc, reference) {
            var instance = reference && createTippy(reference, passedProps);
            if (instance) acc.push(instance);
            return acc;
        }), []);
        return tippy_esm_isElement(targets) ? instances[0] : instances;
    }
    tippy.defaultProps = defaultProps;
    tippy.setDefaultProps = setDefaultProps;
    tippy.currentInput = currentInput;
    Object.assign({}, modifiers_applyStyles, {
        effect: function effect(_ref) {
            var state = _ref.state;
            var initialStyles = {
                popper: {
                    position: state.options.strategy,
                    left: "0",
                    top: "0",
                    margin: "0"
                },
                arrow: {
                    position: "absolute"
                },
                reference: {}
            };
            Object.assign(state.elements.popper.style, initialStyles.popper);
            state.styles = initialStyles;
            if (state.elements.arrow) Object.assign(state.elements.arrow.style, initialStyles.arrow);
        }
    });
    tippy.setDefaultProps({
        render
    });
    const tippy_esm = tippy;
    flsModules.tippy = tippy_esm("[data-tippy-content]", {
        allowHTML: true,
        placement: "bottom"
    });
    function isObject(obj) {
        return obj !== null && typeof obj === "object" && "constructor" in obj && obj.constructor === Object;
    }
    function extend(target = {}, src = {}) {
        Object.keys(src).forEach((key => {
            if (typeof target[key] === "undefined") target[key] = src[key]; else if (isObject(src[key]) && isObject(target[key]) && Object.keys(src[key]).length > 0) extend(target[key], src[key]);
        }));
    }
    const ssrDocument = {
        body: {},
        addEventListener() {},
        removeEventListener() {},
        activeElement: {
            blur() {},
            nodeName: ""
        },
        querySelector() {
            return null;
        },
        querySelectorAll() {
            return [];
        },
        getElementById() {
            return null;
        },
        createEvent() {
            return {
                initEvent() {}
            };
        },
        createElement() {
            return {
                children: [],
                childNodes: [],
                style: {},
                setAttribute() {},
                getElementsByTagName() {
                    return [];
                }
            };
        },
        createElementNS() {
            return {};
        },
        importNode() {
            return null;
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        }
    };
    function ssr_window_esm_getDocument() {
        const doc = typeof document !== "undefined" ? document : {};
        extend(doc, ssrDocument);
        return doc;
    }
    const ssrWindow = {
        document: ssrDocument,
        navigator: {
            userAgent: ""
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        },
        history: {
            replaceState() {},
            pushState() {},
            go() {},
            back() {}
        },
        CustomEvent: function CustomEvent() {
            return this;
        },
        addEventListener() {},
        removeEventListener() {},
        getComputedStyle() {
            return {
                getPropertyValue() {
                    return "";
                }
            };
        },
        Image() {},
        Date() {},
        screen: {},
        setTimeout() {},
        clearTimeout() {},
        matchMedia() {
            return {};
        },
        requestAnimationFrame(callback) {
            if (typeof setTimeout === "undefined") {
                callback();
                return null;
            }
            return setTimeout(callback, 0);
        },
        cancelAnimationFrame(id) {
            if (typeof setTimeout === "undefined") return;
            clearTimeout(id);
        }
    };
    function ssr_window_esm_getWindow() {
        const win = typeof window !== "undefined" ? window : {};
        extend(win, ssrWindow);
        return win;
    }
    function makeReactive(obj) {
        const proto = obj.__proto__;
        Object.defineProperty(obj, "__proto__", {
            get() {
                return proto;
            },
            set(value) {
                proto.__proto__ = value;
            }
        });
    }
    class Dom7 extends Array {
        constructor(items) {
            if (typeof items === "number") super(items); else {
                super(...items || []);
                makeReactive(this);
            }
        }
    }
    function arrayFlat(arr = []) {
        const res = [];
        arr.forEach((el => {
            if (Array.isArray(el)) res.push(...arrayFlat(el)); else res.push(el);
        }));
        return res;
    }
    function arrayFilter(arr, callback) {
        return Array.prototype.filter.call(arr, callback);
    }
    function arrayUnique(arr) {
        const uniqueArray = [];
        for (let i = 0; i < arr.length; i += 1) if (uniqueArray.indexOf(arr[i]) === -1) uniqueArray.push(arr[i]);
        return uniqueArray;
    }
    function qsa(selector, context) {
        if (typeof selector !== "string") return [ selector ];
        const a = [];
        const res = context.querySelectorAll(selector);
        for (let i = 0; i < res.length; i += 1) a.push(res[i]);
        return a;
    }
    function dom7_esm_$(selector, context) {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        let arr = [];
        if (!context && selector instanceof Dom7) return selector;
        if (!selector) return new Dom7(arr);
        if (typeof selector === "string") {
            const html = selector.trim();
            if (html.indexOf("<") >= 0 && html.indexOf(">") >= 0) {
                let toCreate = "div";
                if (html.indexOf("<li") === 0) toCreate = "ul";
                if (html.indexOf("<tr") === 0) toCreate = "tbody";
                if (html.indexOf("<td") === 0 || html.indexOf("<th") === 0) toCreate = "tr";
                if (html.indexOf("<tbody") === 0) toCreate = "table";
                if (html.indexOf("<option") === 0) toCreate = "select";
                const tempParent = document.createElement(toCreate);
                tempParent.innerHTML = html;
                for (let i = 0; i < tempParent.childNodes.length; i += 1) arr.push(tempParent.childNodes[i]);
            } else arr = qsa(selector.trim(), context || document);
        } else if (selector.nodeType || selector === window || selector === document) arr.push(selector); else if (Array.isArray(selector)) {
            if (selector instanceof Dom7) return selector;
            arr = selector;
        }
        return new Dom7(arrayUnique(arr));
    }
    dom7_esm_$.fn = Dom7.prototype;
    function addClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            el.classList.add(...classNames);
        }));
        return this;
    }
    function removeClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            el.classList.remove(...classNames);
        }));
        return this;
    }
    function toggleClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            classNames.forEach((className => {
                el.classList.toggle(className);
            }));
        }));
    }
    function hasClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        return arrayFilter(this, (el => classNames.filter((className => el.classList.contains(className))).length > 0)).length > 0;
    }
    function attr(attrs, value) {
        if (arguments.length === 1 && typeof attrs === "string") {
            if (this[0]) return this[0].getAttribute(attrs);
            return;
        }
        for (let i = 0; i < this.length; i += 1) if (arguments.length === 2) this[i].setAttribute(attrs, value); else for (const attrName in attrs) {
            this[i][attrName] = attrs[attrName];
            this[i].setAttribute(attrName, attrs[attrName]);
        }
        return this;
    }
    function removeAttr(attr) {
        for (let i = 0; i < this.length; i += 1) this[i].removeAttribute(attr);
        return this;
    }
    function transform(transform) {
        for (let i = 0; i < this.length; i += 1) this[i].style.transform = transform;
        return this;
    }
    function transition(duration) {
        for (let i = 0; i < this.length; i += 1) this[i].style.transitionDuration = typeof duration !== "string" ? `${duration}ms` : duration;
        return this;
    }
    function on(...args) {
        let [eventType, targetSelector, listener, capture] = args;
        if (typeof args[1] === "function") {
            [eventType, listener, capture] = args;
            targetSelector = void 0;
        }
        if (!capture) capture = false;
        function handleLiveEvent(e) {
            const target = e.target;
            if (!target) return;
            const eventData = e.target.dom7EventData || [];
            if (eventData.indexOf(e) < 0) eventData.unshift(e);
            if (dom7_esm_$(target).is(targetSelector)) listener.apply(target, eventData); else {
                const parents = dom7_esm_$(target).parents();
                for (let k = 0; k < parents.length; k += 1) if (dom7_esm_$(parents[k]).is(targetSelector)) listener.apply(parents[k], eventData);
            }
        }
        function handleEvent(e) {
            const eventData = e && e.target ? e.target.dom7EventData || [] : [];
            if (eventData.indexOf(e) < 0) eventData.unshift(e);
            listener.apply(this, eventData);
        }
        const events = eventType.split(" ");
        let j;
        for (let i = 0; i < this.length; i += 1) {
            const el = this[i];
            if (!targetSelector) for (j = 0; j < events.length; j += 1) {
                const event = events[j];
                if (!el.dom7Listeners) el.dom7Listeners = {};
                if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
                el.dom7Listeners[event].push({
                    listener,
                    proxyListener: handleEvent
                });
                el.addEventListener(event, handleEvent, capture);
            } else for (j = 0; j < events.length; j += 1) {
                const event = events[j];
                if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
                if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
                el.dom7LiveListeners[event].push({
                    listener,
                    proxyListener: handleLiveEvent
                });
                el.addEventListener(event, handleLiveEvent, capture);
            }
        }
        return this;
    }
    function off(...args) {
        let [eventType, targetSelector, listener, capture] = args;
        if (typeof args[1] === "function") {
            [eventType, listener, capture] = args;
            targetSelector = void 0;
        }
        if (!capture) capture = false;
        const events = eventType.split(" ");
        for (let i = 0; i < events.length; i += 1) {
            const event = events[i];
            for (let j = 0; j < this.length; j += 1) {
                const el = this[j];
                let handlers;
                if (!targetSelector && el.dom7Listeners) handlers = el.dom7Listeners[event]; else if (targetSelector && el.dom7LiveListeners) handlers = el.dom7LiveListeners[event];
                if (handlers && handlers.length) for (let k = handlers.length - 1; k >= 0; k -= 1) {
                    const handler = handlers[k];
                    if (listener && handler.listener === listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    } else if (!listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    }
                }
            }
        }
        return this;
    }
    function trigger(...args) {
        const window = ssr_window_esm_getWindow();
        const events = args[0].split(" ");
        const eventData = args[1];
        for (let i = 0; i < events.length; i += 1) {
            const event = events[i];
            for (let j = 0; j < this.length; j += 1) {
                const el = this[j];
                if (window.CustomEvent) {
                    const evt = new window.CustomEvent(event, {
                        detail: eventData,
                        bubbles: true,
                        cancelable: true
                    });
                    el.dom7EventData = args.filter(((data, dataIndex) => dataIndex > 0));
                    el.dispatchEvent(evt);
                    el.dom7EventData = [];
                    delete el.dom7EventData;
                }
            }
        }
        return this;
    }
    function transitionEnd(callback) {
        const dom = this;
        function fireCallBack(e) {
            if (e.target !== this) return;
            callback.call(this, e);
            dom.off("transitionend", fireCallBack);
        }
        if (callback) dom.on("transitionend", fireCallBack);
        return this;
    }
    function dom7_esm_outerWidth(includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                const styles = this.styles();
                return this[0].offsetWidth + parseFloat(styles.getPropertyValue("margin-right")) + parseFloat(styles.getPropertyValue("margin-left"));
            }
            return this[0].offsetWidth;
        }
        return null;
    }
    function dom7_esm_outerHeight(includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                const styles = this.styles();
                return this[0].offsetHeight + parseFloat(styles.getPropertyValue("margin-top")) + parseFloat(styles.getPropertyValue("margin-bottom"));
            }
            return this[0].offsetHeight;
        }
        return null;
    }
    function dom7_esm_offset() {
        if (this.length > 0) {
            const window = ssr_window_esm_getWindow();
            const document = ssr_window_esm_getDocument();
            const el = this[0];
            const box = el.getBoundingClientRect();
            const body = document.body;
            const clientTop = el.clientTop || body.clientTop || 0;
            const clientLeft = el.clientLeft || body.clientLeft || 0;
            const scrollTop = el === window ? window.scrollY : el.scrollTop;
            const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
            return {
                top: box.top + scrollTop - clientTop,
                left: box.left + scrollLeft - clientLeft
            };
        }
        return null;
    }
    function styles() {
        const window = ssr_window_esm_getWindow();
        if (this[0]) return window.getComputedStyle(this[0], null);
        return {};
    }
    function css(props, value) {
        const window = ssr_window_esm_getWindow();
        let i;
        if (arguments.length === 1) if (typeof props === "string") {
            if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
        } else {
            for (i = 0; i < this.length; i += 1) for (const prop in props) this[i].style[prop] = props[prop];
            return this;
        }
        if (arguments.length === 2 && typeof props === "string") {
            for (i = 0; i < this.length; i += 1) this[i].style[props] = value;
            return this;
        }
        return this;
    }
    function each(callback) {
        if (!callback) return this;
        this.forEach(((el, index) => {
            callback.apply(el, [ el, index ]);
        }));
        return this;
    }
    function filter(callback) {
        const result = arrayFilter(this, callback);
        return dom7_esm_$(result);
    }
    function html(html) {
        if (typeof html === "undefined") return this[0] ? this[0].innerHTML : null;
        for (let i = 0; i < this.length; i += 1) this[i].innerHTML = html;
        return this;
    }
    function dom7_esm_text(text) {
        if (typeof text === "undefined") return this[0] ? this[0].textContent.trim() : null;
        for (let i = 0; i < this.length; i += 1) this[i].textContent = text;
        return this;
    }
    function is(selector) {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        const el = this[0];
        let compareWith;
        let i;
        if (!el || typeof selector === "undefined") return false;
        if (typeof selector === "string") {
            if (el.matches) return el.matches(selector);
            if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
            if (el.msMatchesSelector) return el.msMatchesSelector(selector);
            compareWith = dom7_esm_$(selector);
            for (i = 0; i < compareWith.length; i += 1) if (compareWith[i] === el) return true;
            return false;
        }
        if (selector === document) return el === document;
        if (selector === window) return el === window;
        if (selector.nodeType || selector instanceof Dom7) {
            compareWith = selector.nodeType ? [ selector ] : selector;
            for (i = 0; i < compareWith.length; i += 1) if (compareWith[i] === el) return true;
            return false;
        }
        return false;
    }
    function index() {
        let child = this[0];
        let i;
        if (child) {
            i = 0;
            while ((child = child.previousSibling) !== null) if (child.nodeType === 1) i += 1;
            return i;
        }
        return;
    }
    function eq(index) {
        if (typeof index === "undefined") return this;
        const length = this.length;
        if (index > length - 1) return dom7_esm_$([]);
        if (index < 0) {
            const returnIndex = length + index;
            if (returnIndex < 0) return dom7_esm_$([]);
            return dom7_esm_$([ this[returnIndex] ]);
        }
        return dom7_esm_$([ this[index] ]);
    }
    function append(...els) {
        let newChild;
        const document = ssr_window_esm_getDocument();
        for (let k = 0; k < els.length; k += 1) {
            newChild = els[k];
            for (let i = 0; i < this.length; i += 1) if (typeof newChild === "string") {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = newChild;
                while (tempDiv.firstChild) this[i].appendChild(tempDiv.firstChild);
            } else if (newChild instanceof Dom7) for (let j = 0; j < newChild.length; j += 1) this[i].appendChild(newChild[j]); else this[i].appendChild(newChild);
        }
        return this;
    }
    function prepend(newChild) {
        const document = ssr_window_esm_getDocument();
        let i;
        let j;
        for (i = 0; i < this.length; i += 1) if (typeof newChild === "string") {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = newChild;
            for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
        } else if (newChild instanceof Dom7) for (j = 0; j < newChild.length; j += 1) this[i].insertBefore(newChild[j], this[i].childNodes[0]); else this[i].insertBefore(newChild, this[i].childNodes[0]);
        return this;
    }
    function next(selector) {
        if (this.length > 0) {
            if (selector) {
                if (this[0].nextElementSibling && dom7_esm_$(this[0].nextElementSibling).is(selector)) return dom7_esm_$([ this[0].nextElementSibling ]);
                return dom7_esm_$([]);
            }
            if (this[0].nextElementSibling) return dom7_esm_$([ this[0].nextElementSibling ]);
            return dom7_esm_$([]);
        }
        return dom7_esm_$([]);
    }
    function nextAll(selector) {
        const nextEls = [];
        let el = this[0];
        if (!el) return dom7_esm_$([]);
        while (el.nextElementSibling) {
            const next = el.nextElementSibling;
            if (selector) {
                if (dom7_esm_$(next).is(selector)) nextEls.push(next);
            } else nextEls.push(next);
            el = next;
        }
        return dom7_esm_$(nextEls);
    }
    function prev(selector) {
        if (this.length > 0) {
            const el = this[0];
            if (selector) {
                if (el.previousElementSibling && dom7_esm_$(el.previousElementSibling).is(selector)) return dom7_esm_$([ el.previousElementSibling ]);
                return dom7_esm_$([]);
            }
            if (el.previousElementSibling) return dom7_esm_$([ el.previousElementSibling ]);
            return dom7_esm_$([]);
        }
        return dom7_esm_$([]);
    }
    function prevAll(selector) {
        const prevEls = [];
        let el = this[0];
        if (!el) return dom7_esm_$([]);
        while (el.previousElementSibling) {
            const prev = el.previousElementSibling;
            if (selector) {
                if (dom7_esm_$(prev).is(selector)) prevEls.push(prev);
            } else prevEls.push(prev);
            el = prev;
        }
        return dom7_esm_$(prevEls);
    }
    function dom7_esm_parent(selector) {
        const parents = [];
        for (let i = 0; i < this.length; i += 1) if (this[i].parentNode !== null) if (selector) {
            if (dom7_esm_$(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
        } else parents.push(this[i].parentNode);
        return dom7_esm_$(parents);
    }
    function parents(selector) {
        const parents = [];
        for (let i = 0; i < this.length; i += 1) {
            let parent = this[i].parentNode;
            while (parent) {
                if (selector) {
                    if (dom7_esm_$(parent).is(selector)) parents.push(parent);
                } else parents.push(parent);
                parent = parent.parentNode;
            }
        }
        return dom7_esm_$(parents);
    }
    function closest(selector) {
        let closest = this;
        if (typeof selector === "undefined") return dom7_esm_$([]);
        if (!closest.is(selector)) closest = closest.parents(selector).eq(0);
        return closest;
    }
    function find(selector) {
        const foundElements = [];
        for (let i = 0; i < this.length; i += 1) {
            const found = this[i].querySelectorAll(selector);
            for (let j = 0; j < found.length; j += 1) foundElements.push(found[j]);
        }
        return dom7_esm_$(foundElements);
    }
    function children(selector) {
        const children = [];
        for (let i = 0; i < this.length; i += 1) {
            const childNodes = this[i].children;
            for (let j = 0; j < childNodes.length; j += 1) if (!selector || dom7_esm_$(childNodes[j]).is(selector)) children.push(childNodes[j]);
        }
        return dom7_esm_$(children);
    }
    function remove() {
        for (let i = 0; i < this.length; i += 1) if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
        return this;
    }
    const noTrigger = "resize scroll".split(" ");
    function shortcut(name) {
        function eventHandler(...args) {
            if (typeof args[0] === "undefined") {
                for (let i = 0; i < this.length; i += 1) if (noTrigger.indexOf(name) < 0) if (name in this[i]) this[i][name](); else dom7_esm_$(this[i]).trigger(name);
                return this;
            }
            return this.on(name, ...args);
        }
        return eventHandler;
    }
    shortcut("click");
    shortcut("blur");
    shortcut("focus");
    shortcut("focusin");
    shortcut("focusout");
    shortcut("keyup");
    shortcut("keydown");
    shortcut("keypress");
    shortcut("submit");
    shortcut("change");
    shortcut("mousedown");
    shortcut("mousemove");
    shortcut("mouseup");
    shortcut("mouseenter");
    shortcut("mouseleave");
    shortcut("mouseout");
    shortcut("mouseover");
    shortcut("touchstart");
    shortcut("touchend");
    shortcut("touchmove");
    shortcut("resize");
    shortcut("scroll");
    const Methods = {
        addClass,
        removeClass,
        hasClass,
        toggleClass,
        attr,
        removeAttr,
        transform,
        transition,
        on,
        off,
        trigger,
        transitionEnd,
        outerWidth: dom7_esm_outerWidth,
        outerHeight: dom7_esm_outerHeight,
        styles,
        offset: dom7_esm_offset,
        css,
        each,
        html,
        text: dom7_esm_text,
        is,
        index,
        eq,
        append,
        prepend,
        next,
        nextAll,
        prev,
        prevAll,
        parent: dom7_esm_parent,
        parents,
        closest,
        find,
        children,
        filter,
        remove
    };
    Object.keys(Methods).forEach((methodName => {
        Object.defineProperty(dom7_esm_$.fn, methodName, {
            value: Methods[methodName],
            writable: true
        });
    }));
    const dom = dom7_esm_$;
    function deleteProps(obj) {
        const object = obj;
        Object.keys(object).forEach((key => {
            try {
                object[key] = null;
            } catch (e) {}
            try {
                delete object[key];
            } catch (e) {}
        }));
    }
    function utils_nextTick(callback, delay) {
        if (delay === void 0) delay = 0;
        return setTimeout(callback, delay);
    }
    function utils_now() {
        return Date.now();
    }
    function utils_getComputedStyle(el) {
        const window = ssr_window_esm_getWindow();
        let style;
        if (window.getComputedStyle) style = window.getComputedStyle(el, null);
        if (!style && el.currentStyle) style = el.currentStyle;
        if (!style) style = el.style;
        return style;
    }
    function utils_getTranslate(el, axis) {
        if (axis === void 0) axis = "x";
        const window = ssr_window_esm_getWindow();
        let matrix;
        let curTransform;
        let transformMatrix;
        const curStyle = utils_getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            curTransform = curStyle.transform || curStyle.webkitTransform;
            if (curTransform.split(",").length > 6) curTransform = curTransform.split(", ").map((a => a.replace(",", "."))).join(", ");
            transformMatrix = new window.WebKitCSSMatrix(curTransform === "none" ? "" : curTransform);
        } else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
            matrix = transformMatrix.toString().split(",");
        }
        if (axis === "x") if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; else if (matrix.length === 16) curTransform = parseFloat(matrix[12]); else curTransform = parseFloat(matrix[4]);
        if (axis === "y") if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; else if (matrix.length === 16) curTransform = parseFloat(matrix[13]); else curTransform = parseFloat(matrix[5]);
        return curTransform || 0;
    }
    function utils_isObject(o) {
        return typeof o === "object" && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === "Object";
    }
    function isNode(node) {
        if (typeof window !== "undefined" && typeof window.HTMLElement !== "undefined") return node instanceof HTMLElement;
        return node && (node.nodeType === 1 || node.nodeType === 11);
    }
    function utils_extend() {
        const to = Object(arguments.length <= 0 ? void 0 : arguments[0]);
        const noExtend = [ "__proto__", "constructor", "prototype" ];
        for (let i = 1; i < arguments.length; i += 1) {
            const nextSource = i < 0 || arguments.length <= i ? void 0 : arguments[i];
            if (nextSource !== void 0 && nextSource !== null && !isNode(nextSource)) {
                const keysArray = Object.keys(Object(nextSource)).filter((key => noExtend.indexOf(key) < 0));
                for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
                    const nextKey = keysArray[nextIndex];
                    const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== void 0 && desc.enumerable) if (utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]); else if (!utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) {
                        to[nextKey] = {};
                        if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]);
                    } else to[nextKey] = nextSource[nextKey];
                }
            }
        }
        return to;
    }
    function utils_setCSSProperty(el, varName, varValue) {
        el.style.setProperty(varName, varValue);
    }
    function animateCSSModeScroll(_ref) {
        let {swiper, targetPosition, side} = _ref;
        const window = ssr_window_esm_getWindow();
        const startPosition = -swiper.translate;
        let startTime = null;
        let time;
        const duration = swiper.params.speed;
        swiper.wrapperEl.style.scrollSnapType = "none";
        window.cancelAnimationFrame(swiper.cssModeFrameID);
        const dir = targetPosition > startPosition ? "next" : "prev";
        const isOutOfBound = (current, target) => dir === "next" && current >= target || dir === "prev" && current <= target;
        const animate = () => {
            time = (new Date).getTime();
            if (startTime === null) startTime = time;
            const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
            const easeProgress = .5 - Math.cos(progress * Math.PI) / 2;
            let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
            if (isOutOfBound(currentPosition, targetPosition)) currentPosition = targetPosition;
            swiper.wrapperEl.scrollTo({
                [side]: currentPosition
            });
            if (isOutOfBound(currentPosition, targetPosition)) {
                swiper.wrapperEl.style.overflow = "hidden";
                swiper.wrapperEl.style.scrollSnapType = "";
                setTimeout((() => {
                    swiper.wrapperEl.style.overflow = "";
                    swiper.wrapperEl.scrollTo({
                        [side]: currentPosition
                    });
                }));
                window.cancelAnimationFrame(swiper.cssModeFrameID);
                return;
            }
            swiper.cssModeFrameID = window.requestAnimationFrame(animate);
        };
        animate();
    }
    let support;
    function calcSupport() {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        return {
            smoothScroll: document.documentElement && "scrollBehavior" in document.documentElement.style,
            touch: !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch),
            passiveListener: function checkPassiveListener() {
                let supportsPassive = false;
                try {
                    const opts = Object.defineProperty({}, "passive", {
                        get() {
                            supportsPassive = true;
                        }
                    });
                    window.addEventListener("testPassiveListener", null, opts);
                } catch (e) {}
                return supportsPassive;
            }(),
            gestures: function checkGestures() {
                return "ongesturestart" in window;
            }()
        };
    }
    function getSupport() {
        if (!support) support = calcSupport();
        return support;
    }
    let deviceCached;
    function calcDevice(_temp) {
        let {userAgent} = _temp === void 0 ? {} : _temp;
        const support = getSupport();
        const window = ssr_window_esm_getWindow();
        const platform = window.navigator.platform;
        const ua = userAgent || window.navigator.userAgent;
        const device = {
            ios: false,
            android: false
        };
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
        const windows = platform === "Win32";
        let macos = platform === "MacIntel";
        const iPadScreens = [ "1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810" ];
        if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
            ipad = ua.match(/(Version)\/([\d.]+)/);
            if (!ipad) ipad = [ 0, 1, "13_0_0" ];
            macos = false;
        }
        if (android && !windows) {
            device.os = "android";
            device.android = true;
        }
        if (ipad || iphone || ipod) {
            device.os = "ios";
            device.ios = true;
        }
        return device;
    }
    function getDevice(overrides) {
        if (overrides === void 0) overrides = {};
        if (!deviceCached) deviceCached = calcDevice(overrides);
        return deviceCached;
    }
    let browser;
    function calcBrowser() {
        const window = ssr_window_esm_getWindow();
        function isSafari() {
            const ua = window.navigator.userAgent.toLowerCase();
            return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
        }
        return {
            isSafari: isSafari(),
            isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
        };
    }
    function getBrowser() {
        if (!browser) browser = calcBrowser();
        return browser;
    }
    function Resize(_ref) {
        let {swiper, on, emit} = _ref;
        const window = ssr_window_esm_getWindow();
        let observer = null;
        let animationFrame = null;
        const resizeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("beforeResize");
            emit("resize");
        };
        const createObserver = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            observer = new ResizeObserver((entries => {
                animationFrame = window.requestAnimationFrame((() => {
                    const {width, height} = swiper;
                    let newWidth = width;
                    let newHeight = height;
                    entries.forEach((_ref2 => {
                        let {contentBoxSize, contentRect, target} = _ref2;
                        if (target && target !== swiper.el) return;
                        newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
                        newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
                    }));
                    if (newWidth !== width || newHeight !== height) resizeHandler();
                }));
            }));
            observer.observe(swiper.el);
        };
        const removeObserver = () => {
            if (animationFrame) window.cancelAnimationFrame(animationFrame);
            if (observer && observer.unobserve && swiper.el) {
                observer.unobserve(swiper.el);
                observer = null;
            }
        };
        const orientationChangeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("orientationchange");
        };
        on("init", (() => {
            if (swiper.params.resizeObserver && typeof window.ResizeObserver !== "undefined") {
                createObserver();
                return;
            }
            window.addEventListener("resize", resizeHandler);
            window.addEventListener("orientationchange", orientationChangeHandler);
        }));
        on("destroy", (() => {
            removeObserver();
            window.removeEventListener("resize", resizeHandler);
            window.removeEventListener("orientationchange", orientationChangeHandler);
        }));
    }
    function Observer(_ref) {
        let {swiper, extendParams, on, emit} = _ref;
        const observers = [];
        const window = ssr_window_esm_getWindow();
        const attach = function(target, options) {
            if (options === void 0) options = {};
            const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
            const observer = new ObserverFunc((mutations => {
                if (mutations.length === 1) {
                    emit("observerUpdate", mutations[0]);
                    return;
                }
                const observerUpdate = function observerUpdate() {
                    emit("observerUpdate", mutations[0]);
                };
                if (window.requestAnimationFrame) window.requestAnimationFrame(observerUpdate); else window.setTimeout(observerUpdate, 0);
            }));
            observer.observe(target, {
                attributes: typeof options.attributes === "undefined" ? true : options.attributes,
                childList: typeof options.childList === "undefined" ? true : options.childList,
                characterData: typeof options.characterData === "undefined" ? true : options.characterData
            });
            observers.push(observer);
        };
        const init = () => {
            if (!swiper.params.observer) return;
            if (swiper.params.observeParents) {
                const containerParents = swiper.$el.parents();
                for (let i = 0; i < containerParents.length; i += 1) attach(containerParents[i]);
            }
            attach(swiper.$el[0], {
                childList: swiper.params.observeSlideChildren
            });
            attach(swiper.$wrapperEl[0], {
                attributes: false
            });
        };
        const destroy = () => {
            observers.forEach((observer => {
                observer.disconnect();
            }));
            observers.splice(0, observers.length);
        };
        extendParams({
            observer: false,
            observeParents: false,
            observeSlideChildren: false
        });
        on("init", init);
        on("destroy", destroy);
    }
    const events_emitter = {
        on(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (typeof handler !== "function") return self;
            const method = priority ? "unshift" : "push";
            events.split(" ").forEach((event => {
                if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
                self.eventsListeners[event][method](handler);
            }));
            return self;
        },
        once(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (typeof handler !== "function") return self;
            function onceHandler() {
                self.off(events, onceHandler);
                if (onceHandler.__emitterProxy) delete onceHandler.__emitterProxy;
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                handler.apply(self, args);
            }
            onceHandler.__emitterProxy = handler;
            return self.on(events, onceHandler, priority);
        },
        onAny(handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (typeof handler !== "function") return self;
            const method = priority ? "unshift" : "push";
            if (self.eventsAnyListeners.indexOf(handler) < 0) self.eventsAnyListeners[method](handler);
            return self;
        },
        offAny(handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsAnyListeners) return self;
            const index = self.eventsAnyListeners.indexOf(handler);
            if (index >= 0) self.eventsAnyListeners.splice(index, 1);
            return self;
        },
        off(events, handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            events.split(" ").forEach((event => {
                if (typeof handler === "undefined") self.eventsListeners[event] = []; else if (self.eventsListeners[event]) self.eventsListeners[event].forEach(((eventHandler, index) => {
                    if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) self.eventsListeners[event].splice(index, 1);
                }));
            }));
            return self;
        },
        emit() {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            let events;
            let data;
            let context;
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
            if (typeof args[0] === "string" || Array.isArray(args[0])) {
                events = args[0];
                data = args.slice(1, args.length);
                context = self;
            } else {
                events = args[0].events;
                data = args[0].data;
                context = args[0].context || self;
            }
            data.unshift(context);
            const eventsArray = Array.isArray(events) ? events : events.split(" ");
            eventsArray.forEach((event => {
                if (self.eventsAnyListeners && self.eventsAnyListeners.length) self.eventsAnyListeners.forEach((eventHandler => {
                    eventHandler.apply(context, [ event, ...data ]);
                }));
                if (self.eventsListeners && self.eventsListeners[event]) self.eventsListeners[event].forEach((eventHandler => {
                    eventHandler.apply(context, data);
                }));
            }));
            return self;
        }
    };
    function updateSize() {
        const swiper = this;
        let width;
        let height;
        const $el = swiper.$el;
        if (typeof swiper.params.width !== "undefined" && swiper.params.width !== null) width = swiper.params.width; else width = $el[0].clientWidth;
        if (typeof swiper.params.height !== "undefined" && swiper.params.height !== null) height = swiper.params.height; else height = $el[0].clientHeight;
        if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) return;
        width = width - parseInt($el.css("padding-left") || 0, 10) - parseInt($el.css("padding-right") || 0, 10);
        height = height - parseInt($el.css("padding-top") || 0, 10) - parseInt($el.css("padding-bottom") || 0, 10);
        if (Number.isNaN(width)) width = 0;
        if (Number.isNaN(height)) height = 0;
        Object.assign(swiper, {
            width,
            height,
            size: swiper.isHorizontal() ? width : height
        });
    }
    function updateSlides() {
        const swiper = this;
        function getDirectionLabel(property) {
            if (swiper.isHorizontal()) return property;
            return {
                width: "height",
                "margin-top": "margin-left",
                "margin-bottom ": "margin-right",
                "margin-left": "margin-top",
                "margin-right": "margin-bottom",
                "padding-left": "padding-top",
                "padding-right": "padding-bottom",
                marginRight: "marginBottom"
            }[property];
        }
        function getDirectionPropertyValue(node, label) {
            return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
        }
        const params = swiper.params;
        const {$wrapperEl, size: swiperSize, rtlTranslate: rtl, wrongRTL} = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
        const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
        const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
        let snapGrid = [];
        const slidesGrid = [];
        const slidesSizesGrid = [];
        let offsetBefore = params.slidesOffsetBefore;
        if (typeof offsetBefore === "function") offsetBefore = params.slidesOffsetBefore.call(swiper);
        let offsetAfter = params.slidesOffsetAfter;
        if (typeof offsetAfter === "function") offsetAfter = params.slidesOffsetAfter.call(swiper);
        const previousSnapGridLength = swiper.snapGrid.length;
        const previousSlidesGridLength = swiper.slidesGrid.length;
        let spaceBetween = params.spaceBetween;
        let slidePosition = -offsetBefore;
        let prevSlideSize = 0;
        let index = 0;
        if (typeof swiperSize === "undefined") return;
        if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
        swiper.virtualSize = -spaceBetween;
        if (rtl) slides.css({
            marginLeft: "",
            marginBottom: "",
            marginTop: ""
        }); else slides.css({
            marginRight: "",
            marginBottom: "",
            marginTop: ""
        });
        if (params.centeredSlides && params.cssMode) {
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", "");
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", "");
        }
        const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
        if (gridEnabled) swiper.grid.initSlides(slidesLength);
        let slideSize;
        const shouldResetSlideSize = params.slidesPerView === "auto" && params.breakpoints && Object.keys(params.breakpoints).filter((key => typeof params.breakpoints[key].slidesPerView !== "undefined")).length > 0;
        for (let i = 0; i < slidesLength; i += 1) {
            slideSize = 0;
            const slide = slides.eq(i);
            if (gridEnabled) swiper.grid.updateSlide(i, slide, slidesLength, getDirectionLabel);
            if (slide.css("display") === "none") continue;
            if (params.slidesPerView === "auto") {
                if (shouldResetSlideSize) slides[i].style[getDirectionLabel("width")] = ``;
                const slideStyles = getComputedStyle(slide[0]);
                const currentTransform = slide[0].style.transform;
                const currentWebKitTransform = slide[0].style.webkitTransform;
                if (currentTransform) slide[0].style.transform = "none";
                if (currentWebKitTransform) slide[0].style.webkitTransform = "none";
                if (params.roundLengths) slideSize = swiper.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true); else {
                    const width = getDirectionPropertyValue(slideStyles, "width");
                    const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
                    const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
                    const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
                    const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
                    const boxSizing = slideStyles.getPropertyValue("box-sizing");
                    if (boxSizing && boxSizing === "border-box") slideSize = width + marginLeft + marginRight; else {
                        const {clientWidth, offsetWidth} = slide[0];
                        slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
                    }
                }
                if (currentTransform) slide[0].style.transform = currentTransform;
                if (currentWebKitTransform) slide[0].style.webkitTransform = currentWebKitTransform;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
            } else {
                slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
                if (slides[i]) slides[i].style[getDirectionLabel("width")] = `${slideSize}px`;
            }
            if (slides[i]) slides[i].swiperSlideSize = slideSize;
            slidesSizesGrid.push(slideSize);
            if (params.centeredSlides) {
                slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
            } else {
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
                slidePosition = slidePosition + slideSize + spaceBetween;
            }
            swiper.virtualSize += slideSize + spaceBetween;
            prevSlideSize = slideSize;
            index += 1;
        }
        swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
        if (rtl && wrongRTL && (params.effect === "slide" || params.effect === "coverflow")) $wrapperEl.css({
            width: `${swiper.virtualSize + params.spaceBetween}px`
        });
        if (params.setWrapperSize) $wrapperEl.css({
            [getDirectionLabel("width")]: `${swiper.virtualSize + params.spaceBetween}px`
        });
        if (gridEnabled) swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
        if (!params.centeredSlides) {
            const newSlidesGrid = [];
            for (let i = 0; i < snapGrid.length; i += 1) {
                let slidesGridItem = snapGrid[i];
                if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
                if (snapGrid[i] <= swiper.virtualSize - swiperSize) newSlidesGrid.push(slidesGridItem);
            }
            snapGrid = newSlidesGrid;
            if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) snapGrid.push(swiper.virtualSize - swiperSize);
        }
        if (snapGrid.length === 0) snapGrid = [ 0 ];
        if (params.spaceBetween !== 0) {
            const key = swiper.isHorizontal() && rtl ? "marginLeft" : getDirectionLabel("marginRight");
            slides.filter(((_, slideIndex) => {
                if (!params.cssMode) return true;
                if (slideIndex === slides.length - 1) return false;
                return true;
            })).css({
                [key]: `${spaceBetween}px`
            });
        }
        if (params.centeredSlides && params.centeredSlidesBounds) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
            }));
            allSlidesSize -= params.spaceBetween;
            const maxSnap = allSlidesSize - swiperSize;
            snapGrid = snapGrid.map((snap => {
                if (snap < 0) return -offsetBefore;
                if (snap > maxSnap) return maxSnap + offsetAfter;
                return snap;
            }));
        }
        if (params.centerInsufficientSlides) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
            }));
            allSlidesSize -= params.spaceBetween;
            if (allSlidesSize < swiperSize) {
                const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
                snapGrid.forEach(((snap, snapIndex) => {
                    snapGrid[snapIndex] = snap - allSlidesOffset;
                }));
                slidesGrid.forEach(((snap, snapIndex) => {
                    slidesGrid[snapIndex] = snap + allSlidesOffset;
                }));
            }
        }
        Object.assign(swiper, {
            slides,
            snapGrid,
            slidesGrid,
            slidesSizesGrid
        });
        if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
            const addToSnapGrid = -swiper.snapGrid[0];
            const addToSlidesGrid = -swiper.slidesGrid[0];
            swiper.snapGrid = swiper.snapGrid.map((v => v + addToSnapGrid));
            swiper.slidesGrid = swiper.slidesGrid.map((v => v + addToSlidesGrid));
        }
        if (slidesLength !== previousSlidesLength) swiper.emit("slidesLengthChange");
        if (snapGrid.length !== previousSnapGridLength) {
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            swiper.emit("snapGridLengthChange");
        }
        if (slidesGrid.length !== previousSlidesGridLength) swiper.emit("slidesGridLengthChange");
        if (params.watchSlidesProgress) swiper.updateSlidesOffset();
        if (!isVirtual && !params.cssMode && (params.effect === "slide" || params.effect === "fade")) {
            const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
            const hasClassBackfaceClassAdded = swiper.$el.hasClass(backFaceHiddenClass);
            if (slidesLength <= params.maxBackfaceHiddenSlides) {
                if (!hasClassBackfaceClassAdded) swiper.$el.addClass(backFaceHiddenClass);
            } else if (hasClassBackfaceClassAdded) swiper.$el.removeClass(backFaceHiddenClass);
        }
    }
    function updateAutoHeight(speed) {
        const swiper = this;
        const activeSlides = [];
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        let newHeight = 0;
        let i;
        if (typeof speed === "number") swiper.setTransition(speed); else if (speed === true) swiper.setTransition(swiper.params.speed);
        const getSlideByIndex = index => {
            if (isVirtual) return swiper.slides.filter((el => parseInt(el.getAttribute("data-swiper-slide-index"), 10) === index))[0];
            return swiper.slides.eq(index)[0];
        };
        if (swiper.params.slidesPerView !== "auto" && swiper.params.slidesPerView > 1) if (swiper.params.centeredSlides) (swiper.visibleSlides || dom([])).each((slide => {
            activeSlides.push(slide);
        })); else for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
            const index = swiper.activeIndex + i;
            if (index > swiper.slides.length && !isVirtual) break;
            activeSlides.push(getSlideByIndex(index));
        } else activeSlides.push(getSlideByIndex(swiper.activeIndex));
        for (i = 0; i < activeSlides.length; i += 1) if (typeof activeSlides[i] !== "undefined") {
            const height = activeSlides[i].offsetHeight;
            newHeight = height > newHeight ? height : newHeight;
        }
        if (newHeight || newHeight === 0) swiper.$wrapperEl.css("height", `${newHeight}px`);
    }
    function updateSlidesOffset() {
        const swiper = this;
        const slides = swiper.slides;
        for (let i = 0; i < slides.length; i += 1) slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
    }
    function updateSlidesProgress(translate) {
        if (translate === void 0) translate = this && this.translate || 0;
        const swiper = this;
        const params = swiper.params;
        const {slides, rtlTranslate: rtl, snapGrid} = swiper;
        if (slides.length === 0) return;
        if (typeof slides[0].swiperSlideOffset === "undefined") swiper.updateSlidesOffset();
        let offsetCenter = -translate;
        if (rtl) offsetCenter = translate;
        slides.removeClass(params.slideVisibleClass);
        swiper.visibleSlidesIndexes = [];
        swiper.visibleSlides = [];
        for (let i = 0; i < slides.length; i += 1) {
            const slide = slides[i];
            let slideOffset = slide.swiperSlideOffset;
            if (params.cssMode && params.centeredSlides) slideOffset -= slides[0].swiperSlideOffset;
            const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
            const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
            const slideBefore = -(offsetCenter - slideOffset);
            const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
            const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
            if (isVisible) {
                swiper.visibleSlides.push(slide);
                swiper.visibleSlidesIndexes.push(i);
                slides.eq(i).addClass(params.slideVisibleClass);
            }
            slide.progress = rtl ? -slideProgress : slideProgress;
            slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
        }
        swiper.visibleSlides = dom(swiper.visibleSlides);
    }
    function updateProgress(translate) {
        const swiper = this;
        if (typeof translate === "undefined") {
            const multiplier = swiper.rtlTranslate ? -1 : 1;
            translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
        }
        const params = swiper.params;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        let {progress, isBeginning, isEnd} = swiper;
        const wasBeginning = isBeginning;
        const wasEnd = isEnd;
        if (translatesDiff === 0) {
            progress = 0;
            isBeginning = true;
            isEnd = true;
        } else {
            progress = (translate - swiper.minTranslate()) / translatesDiff;
            isBeginning = progress <= 0;
            isEnd = progress >= 1;
        }
        Object.assign(swiper, {
            progress,
            isBeginning,
            isEnd
        });
        if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);
        if (isBeginning && !wasBeginning) swiper.emit("reachBeginning toEdge");
        if (isEnd && !wasEnd) swiper.emit("reachEnd toEdge");
        if (wasBeginning && !isBeginning || wasEnd && !isEnd) swiper.emit("fromEdge");
        swiper.emit("progress", progress);
    }
    function updateSlidesClasses() {
        const swiper = this;
        const {slides, params, $wrapperEl, activeIndex, realIndex} = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);
        let activeSlide;
        if (isVirtual) activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`); else activeSlide = slides.eq(activeIndex);
        activeSlide.addClass(params.slideActiveClass);
        if (params.loop) if (activeSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
        let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);
        if (params.loop && nextSlide.length === 0) {
            nextSlide = slides.eq(0);
            nextSlide.addClass(params.slideNextClass);
        }
        let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);
        if (params.loop && prevSlide.length === 0) {
            prevSlide = slides.eq(-1);
            prevSlide.addClass(params.slidePrevClass);
        }
        if (params.loop) {
            if (nextSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass);
            if (prevSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass);
        }
        swiper.emitSlidesClasses();
    }
    function updateActiveIndex(newActiveIndex) {
        const swiper = this;
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        const {slidesGrid, snapGrid, params, activeIndex: previousIndex, realIndex: previousRealIndex, snapIndex: previousSnapIndex} = swiper;
        let activeIndex = newActiveIndex;
        let snapIndex;
        if (typeof activeIndex === "undefined") {
            for (let i = 0; i < slidesGrid.length; i += 1) if (typeof slidesGrid[i + 1] !== "undefined") {
                if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) activeIndex = i; else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) activeIndex = i + 1;
            } else if (translate >= slidesGrid[i]) activeIndex = i;
            if (params.normalizeSlideIndex) if (activeIndex < 0 || typeof activeIndex === "undefined") activeIndex = 0;
        }
        if (snapGrid.indexOf(translate) >= 0) snapIndex = snapGrid.indexOf(translate); else {
            const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
            snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
        }
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        if (activeIndex === previousIndex) {
            if (snapIndex !== previousSnapIndex) {
                swiper.snapIndex = snapIndex;
                swiper.emit("snapIndexChange");
            }
            return;
        }
        const realIndex = parseInt(swiper.slides.eq(activeIndex).attr("data-swiper-slide-index") || activeIndex, 10);
        Object.assign(swiper, {
            snapIndex,
            realIndex,
            previousIndex,
            activeIndex
        });
        swiper.emit("activeIndexChange");
        swiper.emit("snapIndexChange");
        if (previousRealIndex !== realIndex) swiper.emit("realIndexChange");
        if (swiper.initialized || swiper.params.runCallbacksOnInit) swiper.emit("slideChange");
    }
    function updateClickedSlide(e) {
        const swiper = this;
        const params = swiper.params;
        const slide = dom(e).closest(`.${params.slideClass}`)[0];
        let slideFound = false;
        let slideIndex;
        if (slide) for (let i = 0; i < swiper.slides.length; i += 1) if (swiper.slides[i] === slide) {
            slideFound = true;
            slideIndex = i;
            break;
        }
        if (slide && slideFound) {
            swiper.clickedSlide = slide;
            if (swiper.virtual && swiper.params.virtual.enabled) swiper.clickedIndex = parseInt(dom(slide).attr("data-swiper-slide-index"), 10); else swiper.clickedIndex = slideIndex;
        } else {
            swiper.clickedSlide = void 0;
            swiper.clickedIndex = void 0;
            return;
        }
        if (params.slideToClickedSlide && swiper.clickedIndex !== void 0 && swiper.clickedIndex !== swiper.activeIndex) swiper.slideToClickedSlide();
    }
    const update = {
        updateSize,
        updateSlides,
        updateAutoHeight,
        updateSlidesOffset,
        updateSlidesProgress,
        updateProgress,
        updateSlidesClasses,
        updateActiveIndex,
        updateClickedSlide
    };
    function getSwiperTranslate(axis) {
        if (axis === void 0) axis = this.isHorizontal() ? "x" : "y";
        const swiper = this;
        const {params, rtlTranslate: rtl, translate, $wrapperEl} = swiper;
        if (params.virtualTranslate) return rtl ? -translate : translate;
        if (params.cssMode) return translate;
        let currentTranslate = utils_getTranslate($wrapperEl[0], axis);
        if (rtl) currentTranslate = -currentTranslate;
        return currentTranslate || 0;
    }
    function setTranslate(translate, byController) {
        const swiper = this;
        const {rtlTranslate: rtl, params, $wrapperEl, wrapperEl, progress} = swiper;
        let x = 0;
        let y = 0;
        const z = 0;
        if (swiper.isHorizontal()) x = rtl ? -translate : translate; else y = translate;
        if (params.roundLengths) {
            x = Math.floor(x);
            y = Math.floor(y);
        }
        if (params.cssMode) wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y; else if (!params.virtualTranslate) $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
        swiper.previousTranslate = swiper.translate;
        swiper.translate = swiper.isHorizontal() ? x : y;
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (translatesDiff === 0) newProgress = 0; else newProgress = (translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== progress) swiper.updateProgress(translate);
        swiper.emit("setTranslate", swiper.translate, byController);
    }
    function minTranslate() {
        return -this.snapGrid[0];
    }
    function maxTranslate() {
        return -this.snapGrid[this.snapGrid.length - 1];
    }
    function translateTo(translate, speed, runCallbacks, translateBounds, internal) {
        if (translate === void 0) translate = 0;
        if (speed === void 0) speed = this.params.speed;
        if (runCallbacks === void 0) runCallbacks = true;
        if (translateBounds === void 0) translateBounds = true;
        const swiper = this;
        const {params, wrapperEl} = swiper;
        if (swiper.animating && params.preventInteractionOnTransition) return false;
        const minTranslate = swiper.minTranslate();
        const maxTranslate = swiper.maxTranslate();
        let newTranslate;
        if (translateBounds && translate > minTranslate) newTranslate = minTranslate; else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate; else newTranslate = translate;
        swiper.updateProgress(newTranslate);
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            if (speed === 0) wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate; else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: -newTranslate,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: -newTranslate,
                    behavior: "smooth"
                });
            }
            return true;
        }
        if (speed === 0) {
            swiper.setTransition(0);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionEnd");
            }
        } else {
            swiper.setTransition(speed);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionStart");
            }
            if (!swiper.animating) {
                swiper.animating = true;
                if (!swiper.onTranslateToWrapperTransitionEnd) swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
                    if (!swiper || swiper.destroyed) return;
                    if (e.target !== this) return;
                    swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.onTranslateToWrapperTransitionEnd = null;
                    delete swiper.onTranslateToWrapperTransitionEnd;
                    if (runCallbacks) swiper.emit("transitionEnd");
                };
                swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
            }
        }
        return true;
    }
    const translate = {
        getTranslate: getSwiperTranslate,
        setTranslate,
        minTranslate,
        maxTranslate,
        translateTo
    };
    function setTransition(duration, byController) {
        const swiper = this;
        if (!swiper.params.cssMode) swiper.$wrapperEl.transition(duration);
        swiper.emit("setTransition", duration, byController);
    }
    function transitionEmit(_ref) {
        let {swiper, runCallbacks, direction, step} = _ref;
        const {activeIndex, previousIndex} = swiper;
        let dir = direction;
        if (!dir) if (activeIndex > previousIndex) dir = "next"; else if (activeIndex < previousIndex) dir = "prev"; else dir = "reset";
        swiper.emit(`transition${step}`);
        if (runCallbacks && activeIndex !== previousIndex) {
            if (dir === "reset") {
                swiper.emit(`slideResetTransition${step}`);
                return;
            }
            swiper.emit(`slideChangeTransition${step}`);
            if (dir === "next") swiper.emit(`slideNextTransition${step}`); else swiper.emit(`slidePrevTransition${step}`);
        }
    }
    function transitionStart_transitionStart(runCallbacks, direction) {
        if (runCallbacks === void 0) runCallbacks = true;
        const swiper = this;
        const {params} = swiper;
        if (params.cssMode) return;
        if (params.autoHeight) swiper.updateAutoHeight();
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "Start"
        });
    }
    function transitionEnd_transitionEnd(runCallbacks, direction) {
        if (runCallbacks === void 0) runCallbacks = true;
        const swiper = this;
        const {params} = swiper;
        swiper.animating = false;
        if (params.cssMode) return;
        swiper.setTransition(0);
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "End"
        });
    }
    const core_transition = {
        setTransition,
        transitionStart: transitionStart_transitionStart,
        transitionEnd: transitionEnd_transitionEnd
    };
    function slideTo(index, speed, runCallbacks, internal, initial) {
        if (index === void 0) index = 0;
        if (speed === void 0) speed = this.params.speed;
        if (runCallbacks === void 0) runCallbacks = true;
        if (typeof index !== "number" && typeof index !== "string") throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index}] given.`);
        if (typeof index === "string") {
            const indexAsNumber = parseInt(index, 10);
            const isValidNumber = isFinite(indexAsNumber);
            if (!isValidNumber) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
            index = indexAsNumber;
        }
        const swiper = this;
        let slideIndex = index;
        if (slideIndex < 0) slideIndex = 0;
        const {params, snapGrid, slidesGrid, previousIndex, activeIndex, rtlTranslate: rtl, wrapperEl, enabled} = swiper;
        if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) return false;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
        let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        if ((activeIndex || params.initialSlide || 0) === (previousIndex || 0) && runCallbacks) swiper.emit("beforeSlideChangeStart");
        const translate = -snapGrid[snapIndex];
        swiper.updateProgress(translate);
        if (params.normalizeSlideIndex) for (let i = 0; i < slidesGrid.length; i += 1) {
            const normalizedTranslate = -Math.floor(translate * 100);
            const normalizedGrid = Math.floor(slidesGrid[i] * 100);
            const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);
            if (typeof slidesGrid[i + 1] !== "undefined") {
                if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) slideIndex = i; else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) slideIndex = i + 1;
            } else if (normalizedTranslate >= normalizedGrid) slideIndex = i;
        }
        if (swiper.initialized && slideIndex !== activeIndex) {
            if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) return false;
            if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) if ((activeIndex || 0) !== slideIndex) return false;
        }
        let direction;
        if (slideIndex > activeIndex) direction = "next"; else if (slideIndex < activeIndex) direction = "prev"; else direction = "reset";
        if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
            swiper.updateActiveIndex(slideIndex);
            if (params.autoHeight) swiper.updateAutoHeight();
            swiper.updateSlidesClasses();
            if (params.effect !== "slide") swiper.setTranslate(translate);
            if (direction !== "reset") {
                swiper.transitionStart(runCallbacks, direction);
                swiper.transitionEnd(runCallbacks, direction);
            }
            return false;
        }
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            const t = rtl ? translate : -translate;
            if (speed === 0) {
                const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
                if (isVirtual) {
                    swiper.wrapperEl.style.scrollSnapType = "none";
                    swiper._immediateVirtual = true;
                }
                wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
                if (isVirtual) requestAnimationFrame((() => {
                    swiper.wrapperEl.style.scrollSnapType = "";
                    swiper._swiperImmediateVirtual = false;
                }));
            } else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: t,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: t,
                    behavior: "smooth"
                });
            }
            return true;
        }
        swiper.setTransition(speed);
        swiper.setTranslate(translate);
        swiper.updateActiveIndex(slideIndex);
        swiper.updateSlidesClasses();
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.transitionStart(runCallbacks, direction);
        if (speed === 0) swiper.transitionEnd(runCallbacks, direction); else if (!swiper.animating) {
            swiper.animating = true;
            if (!swiper.onSlideToWrapperTransitionEnd) swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
                if (!swiper || swiper.destroyed) return;
                if (e.target !== this) return;
                swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
                swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
                swiper.onSlideToWrapperTransitionEnd = null;
                delete swiper.onSlideToWrapperTransitionEnd;
                swiper.transitionEnd(runCallbacks, direction);
            };
            swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
            swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
        }
        return true;
    }
    function slideToLoop(index, speed, runCallbacks, internal) {
        if (index === void 0) index = 0;
        if (speed === void 0) speed = this.params.speed;
        if (runCallbacks === void 0) runCallbacks = true;
        if (typeof index === "string") {
            const indexAsNumber = parseInt(index, 10);
            const isValidNumber = isFinite(indexAsNumber);
            if (!isValidNumber) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
            index = indexAsNumber;
        }
        const swiper = this;
        let newIndex = index;
        if (swiper.params.loop) newIndex += swiper.loopedSlides;
        return swiper.slideTo(newIndex, speed, runCallbacks, internal);
    }
    function slideNext(speed, runCallbacks, internal) {
        if (speed === void 0) speed = this.params.speed;
        if (runCallbacks === void 0) runCallbacks = true;
        const swiper = this;
        const {animating, enabled, params} = swiper;
        if (!enabled) return swiper;
        let perGroup = params.slidesPerGroup;
        if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
        const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
        if (params.loop) {
            if (animating && params.loopPreventsSlide) return false;
            swiper.loopFix();
            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        }
        if (params.rewind && swiper.isEnd) return swiper.slideTo(0, speed, runCallbacks, internal);
        return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
    }
    function slidePrev(speed, runCallbacks, internal) {
        if (speed === void 0) speed = this.params.speed;
        if (runCallbacks === void 0) runCallbacks = true;
        const swiper = this;
        const {params, animating, snapGrid, slidesGrid, rtlTranslate, enabled} = swiper;
        if (!enabled) return swiper;
        if (params.loop) {
            if (animating && params.loopPreventsSlide) return false;
            swiper.loopFix();
            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        }
        const translate = rtlTranslate ? swiper.translate : -swiper.translate;
        function normalize(val) {
            if (val < 0) return -Math.floor(Math.abs(val));
            return Math.floor(val);
        }
        const normalizedTranslate = normalize(translate);
        const normalizedSnapGrid = snapGrid.map((val => normalize(val)));
        let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
        if (typeof prevSnap === "undefined" && params.cssMode) {
            let prevSnapIndex;
            snapGrid.forEach(((snap, snapIndex) => {
                if (normalizedTranslate >= snap) prevSnapIndex = snapIndex;
            }));
            if (typeof prevSnapIndex !== "undefined") prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
        }
        let prevIndex = 0;
        if (typeof prevSnap !== "undefined") {
            prevIndex = slidesGrid.indexOf(prevSnap);
            if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
            if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
                prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
                prevIndex = Math.max(prevIndex, 0);
            }
        }
        if (params.rewind && swiper.isBeginning) {
            const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
            return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
        }
        return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    }
    function slideReset(speed, runCallbacks, internal) {
        if (speed === void 0) speed = this.params.speed;
        if (runCallbacks === void 0) runCallbacks = true;
        const swiper = this;
        return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
    }
    function slideToClosest(speed, runCallbacks, internal, threshold) {
        if (speed === void 0) speed = this.params.speed;
        if (runCallbacks === void 0) runCallbacks = true;
        if (threshold === void 0) threshold = .5;
        const swiper = this;
        let index = swiper.activeIndex;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
        const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        if (translate >= swiper.snapGrid[snapIndex]) {
            const currentSnap = swiper.snapGrid[snapIndex];
            const nextSnap = swiper.snapGrid[snapIndex + 1];
            if (translate - currentSnap > (nextSnap - currentSnap) * threshold) index += swiper.params.slidesPerGroup;
        } else {
            const prevSnap = swiper.snapGrid[snapIndex - 1];
            const currentSnap = swiper.snapGrid[snapIndex];
            if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) index -= swiper.params.slidesPerGroup;
        }
        index = Math.max(index, 0);
        index = Math.min(index, swiper.slidesGrid.length - 1);
        return swiper.slideTo(index, speed, runCallbacks, internal);
    }
    function slideToClickedSlide() {
        const swiper = this;
        const {params, $wrapperEl} = swiper;
        const slidesPerView = params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : params.slidesPerView;
        let slideToIndex = swiper.clickedIndex;
        let realIndex;
        if (params.loop) {
            if (swiper.animating) return;
            realIndex = parseInt(dom(swiper.clickedSlide).attr("data-swiper-slide-index"), 10);
            if (params.centeredSlides) if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
                swiper.loopFix();
                slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex); else if (slideToIndex > swiper.slides.length - slidesPerView) {
                swiper.loopFix();
                slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex);
        } else swiper.slideTo(slideToIndex);
    }
    const slide = {
        slideTo,
        slideToLoop,
        slideNext,
        slidePrev,
        slideReset,
        slideToClosest,
        slideToClickedSlide
    };
    function loopCreate() {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const {params, $wrapperEl} = swiper;
        const $selector = $wrapperEl.children().length > 0 ? dom($wrapperEl.children()[0].parentNode) : $wrapperEl;
        $selector.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();
        let slides = $selector.children(`.${params.slideClass}`);
        if (params.loopFillGroupWithBlank) {
            const blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;
            if (blankSlidesNum !== params.slidesPerGroup) {
                for (let i = 0; i < blankSlidesNum; i += 1) {
                    const blankNode = dom(document.createElement("div")).addClass(`${params.slideClass} ${params.slideBlankClass}`);
                    $selector.append(blankNode);
                }
                slides = $selector.children(`.${params.slideClass}`);
            }
        }
        if (params.slidesPerView === "auto" && !params.loopedSlides) params.loopedSlides = slides.length;
        swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
        swiper.loopedSlides += params.loopAdditionalSlides;
        if (swiper.loopedSlides > slides.length && swiper.params.loopedSlidesLimit) swiper.loopedSlides = slides.length;
        const prependSlides = [];
        const appendSlides = [];
        slides.each(((el, index) => {
            dom(el).attr("data-swiper-slide-index", index);
        }));
        for (let i = 0; i < swiper.loopedSlides; i += 1) {
            const index = i - Math.floor(i / slides.length) * slides.length;
            appendSlides.push(slides.eq(index)[0]);
            prependSlides.unshift(slides.eq(slides.length - index - 1)[0]);
        }
        for (let i = 0; i < appendSlides.length; i += 1) $selector.append(dom(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
        for (let i = prependSlides.length - 1; i >= 0; i -= 1) $selector.prepend(dom(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
    }
    function loopFix() {
        const swiper = this;
        swiper.emit("beforeLoopFix");
        const {activeIndex, slides, loopedSlides, allowSlidePrev, allowSlideNext, snapGrid, rtlTranslate: rtl} = swiper;
        let newIndex;
        swiper.allowSlidePrev = true;
        swiper.allowSlideNext = true;
        const snapTranslate = -snapGrid[activeIndex];
        const diff = snapTranslate - swiper.getTranslate();
        if (activeIndex < loopedSlides) {
            newIndex = slides.length - loopedSlides * 3 + activeIndex;
            newIndex += loopedSlides;
            const slideChanged = swiper.slideTo(newIndex, 0, false, true);
            if (slideChanged && diff !== 0) swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        } else if (activeIndex >= slides.length - loopedSlides) {
            newIndex = -slides.length + activeIndex + loopedSlides;
            newIndex += loopedSlides;
            const slideChanged = swiper.slideTo(newIndex, 0, false, true);
            if (slideChanged && diff !== 0) swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        }
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        swiper.emit("loopFix");
    }
    function loopDestroy() {
        const swiper = this;
        const {$wrapperEl, params, slides} = swiper;
        $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
        slides.removeAttr("data-swiper-slide-index");
    }
    const loop = {
        loopCreate,
        loopFix,
        loopDestroy
    };
    function setGrabCursor(moving) {
        const swiper = this;
        if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        const el = swiper.params.touchEventsTarget === "container" ? swiper.el : swiper.wrapperEl;
        el.style.cursor = "move";
        el.style.cursor = moving ? "grabbing" : "grab";
    }
    function unsetGrabCursor() {
        const swiper = this;
        if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        swiper[swiper.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "";
    }
    const grab_cursor = {
        setGrabCursor,
        unsetGrabCursor
    };
    function closestElement(selector, base) {
        if (base === void 0) base = this;
        function __closestFrom(el) {
            if (!el || el === ssr_window_esm_getDocument() || el === ssr_window_esm_getWindow()) return null;
            if (el.assignedSlot) el = el.assignedSlot;
            const found = el.closest(selector);
            if (!found && !el.getRootNode) return null;
            return found || __closestFrom(el.getRootNode().host);
        }
        return __closestFrom(base);
    }
    function onTouchStart(event) {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const window = ssr_window_esm_getWindow();
        const data = swiper.touchEventsData;
        const {params, touches, enabled} = swiper;
        if (!enabled) return;
        if (swiper.animating && params.preventInteractionOnTransition) return;
        if (!swiper.animating && params.cssMode && params.loop) swiper.loopFix();
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        let $targetEl = dom(e.target);
        if (params.touchEventsTarget === "wrapper") if (!$targetEl.closest(swiper.wrapperEl).length) return;
        data.isTouchEvent = e.type === "touchstart";
        if (!data.isTouchEvent && "which" in e && e.which === 3) return;
        if (!data.isTouchEvent && "button" in e && e.button > 0) return;
        if (data.isTouched && data.isMoved) return;
        const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== "";
        if (swipingClassHasValue && e.target && e.target.shadowRoot && event.path && event.path[0]) $targetEl = dom(event.path[0]);
        const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
        const isTargetShadow = !!(e.target && e.target.shadowRoot);
        if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, $targetEl[0]) : $targetEl.closest(noSwipingSelector)[0])) {
            swiper.allowClick = true;
            return;
        }
        if (params.swipeHandler) if (!$targetEl.closest(params.swipeHandler)[0]) return;
        touches.currentX = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX;
        touches.currentY = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY;
        const startX = touches.currentX;
        const startY = touches.currentY;
        const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
        const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
        if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) if (edgeSwipeDetection === "prevent") event.preventDefault(); else return;
        Object.assign(data, {
            isTouched: true,
            isMoved: false,
            allowTouchCallbacks: true,
            isScrolling: void 0,
            startMoving: void 0
        });
        touches.startX = startX;
        touches.startY = startY;
        data.touchStartTime = utils_now();
        swiper.allowClick = true;
        swiper.updateSize();
        swiper.swipeDirection = void 0;
        if (params.threshold > 0) data.allowThresholdMove = false;
        if (e.type !== "touchstart") {
            let preventDefault = true;
            if ($targetEl.is(data.focusableElements)) {
                preventDefault = false;
                if ($targetEl[0].nodeName === "SELECT") data.isTouched = false;
            }
            if (document.activeElement && dom(document.activeElement).is(data.focusableElements) && document.activeElement !== $targetEl[0]) document.activeElement.blur();
            const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
            if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) e.preventDefault();
        }
        if (swiper.params.freeMode && swiper.params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) swiper.freeMode.onTouchStart();
        swiper.emit("touchStart", e);
    }
    function onTouchMove(event) {
        const document = ssr_window_esm_getDocument();
        const swiper = this;
        const data = swiper.touchEventsData;
        const {params, touches, rtlTranslate: rtl, enabled} = swiper;
        if (!enabled) return;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (!data.isTouched) {
            if (data.startMoving && data.isScrolling) swiper.emit("touchMoveOpposite", e);
            return;
        }
        if (data.isTouchEvent && e.type !== "touchmove") return;
        const targetTouch = e.type === "touchmove" && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
        const pageX = e.type === "touchmove" ? targetTouch.pageX : e.pageX;
        const pageY = e.type === "touchmove" ? targetTouch.pageY : e.pageY;
        if (e.preventedByNestedSwiper) {
            touches.startX = pageX;
            touches.startY = pageY;
            return;
        }
        if (!swiper.allowTouchMove) {
            if (!dom(e.target).is(data.focusableElements)) swiper.allowClick = false;
            if (data.isTouched) {
                Object.assign(touches, {
                    startX: pageX,
                    startY: pageY,
                    currentX: pageX,
                    currentY: pageY
                });
                data.touchStartTime = utils_now();
            }
            return;
        }
        if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) if (swiper.isVertical()) {
            if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
                data.isTouched = false;
                data.isMoved = false;
                return;
            }
        } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) return;
        if (data.isTouchEvent && document.activeElement) if (e.target === document.activeElement && dom(e.target).is(data.focusableElements)) {
            data.isMoved = true;
            swiper.allowClick = false;
            return;
        }
        if (data.allowTouchCallbacks) swiper.emit("touchMove", e);
        if (e.targetTouches && e.targetTouches.length > 1) return;
        touches.currentX = pageX;
        touches.currentY = pageY;
        const diffX = touches.currentX - touches.startX;
        const diffY = touches.currentY - touches.startY;
        if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
        if (typeof data.isScrolling === "undefined") {
            let touchAngle;
            if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) data.isScrolling = false; else if (diffX * diffX + diffY * diffY >= 25) {
                touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
                data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
            }
        }
        if (data.isScrolling) swiper.emit("touchMoveOpposite", e);
        if (typeof data.startMoving === "undefined") if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) data.startMoving = true;
        if (data.isScrolling) {
            data.isTouched = false;
            return;
        }
        if (!data.startMoving) return;
        swiper.allowClick = false;
        if (!params.cssMode && e.cancelable) e.preventDefault();
        if (params.touchMoveStopPropagation && !params.nested) e.stopPropagation();
        if (!data.isMoved) {
            if (params.loop && !params.cssMode) swiper.loopFix();
            data.startTranslate = swiper.getTranslate();
            swiper.setTransition(0);
            if (swiper.animating) swiper.$wrapperEl.trigger("webkitTransitionEnd transitionend");
            data.allowMomentumBounce = false;
            if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) swiper.setGrabCursor(true);
            swiper.emit("sliderFirstMove", e);
        }
        swiper.emit("sliderMove", e);
        data.isMoved = true;
        let diff = swiper.isHorizontal() ? diffX : diffY;
        touches.diff = diff;
        diff *= params.touchRatio;
        if (rtl) diff = -diff;
        swiper.swipeDirection = diff > 0 ? "prev" : "next";
        data.currentTranslate = diff + data.startTranslate;
        let disableParentSwiper = true;
        let resistanceRatio = params.resistanceRatio;
        if (params.touchReleaseOnEdges) resistanceRatio = 0;
        if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
            disableParentSwiper = false;
            if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
        } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
            disableParentSwiper = false;
            if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
        }
        if (disableParentSwiper) e.preventedByNestedSwiper = true;
        if (!swiper.allowSlideNext && swiper.swipeDirection === "next" && data.currentTranslate < data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && swiper.swipeDirection === "prev" && data.currentTranslate > data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && !swiper.allowSlideNext) data.currentTranslate = data.startTranslate;
        if (params.threshold > 0) if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
            if (!data.allowThresholdMove) {
                data.allowThresholdMove = true;
                touches.startX = touches.currentX;
                touches.startY = touches.currentY;
                data.currentTranslate = data.startTranslate;
                touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
                return;
            }
        } else {
            data.currentTranslate = data.startTranslate;
            return;
        }
        if (!params.followFinger || params.cssMode) return;
        if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) swiper.freeMode.onTouchMove();
        swiper.updateProgress(data.currentTranslate);
        swiper.setTranslate(data.currentTranslate);
    }
    function onTouchEnd(event) {
        const swiper = this;
        const data = swiper.touchEventsData;
        const {params, touches, rtlTranslate: rtl, slidesGrid, enabled} = swiper;
        if (!enabled) return;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (data.allowTouchCallbacks) swiper.emit("touchEnd", e);
        data.allowTouchCallbacks = false;
        if (!data.isTouched) {
            if (data.isMoved && params.grabCursor) swiper.setGrabCursor(false);
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) swiper.setGrabCursor(false);
        const touchEndTime = utils_now();
        const timeDiff = touchEndTime - data.touchStartTime;
        if (swiper.allowClick) {
            const pathTree = e.path || e.composedPath && e.composedPath();
            swiper.updateClickedSlide(pathTree && pathTree[0] || e.target);
            swiper.emit("tap click", e);
            if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) swiper.emit("doubleTap doubleClick", e);
        }
        data.lastClickTime = utils_now();
        utils_nextTick((() => {
            if (!swiper.destroyed) swiper.allowClick = true;
        }));
        if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
            data.isTouched = false;
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        data.isTouched = false;
        data.isMoved = false;
        data.startMoving = false;
        let currentPos;
        if (params.followFinger) currentPos = rtl ? swiper.translate : -swiper.translate; else currentPos = -data.currentTranslate;
        if (params.cssMode) return;
        if (swiper.params.freeMode && params.freeMode.enabled) {
            swiper.freeMode.onTouchEnd({
                currentPos
            });
            return;
        }
        let stopIndex = 0;
        let groupSize = swiper.slidesSizesGrid[0];
        for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
            const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
            if (typeof slidesGrid[i + increment] !== "undefined") {
                if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
                    stopIndex = i;
                    groupSize = slidesGrid[i + increment] - slidesGrid[i];
                }
            } else if (currentPos >= slidesGrid[i]) {
                stopIndex = i;
                groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
            }
        }
        let rewindFirstIndex = null;
        let rewindLastIndex = null;
        if (params.rewind) if (swiper.isBeginning) rewindLastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1; else if (swiper.isEnd) rewindFirstIndex = 0;
        const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
        const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
        if (timeDiff > params.longSwipesMs) {
            if (!params.longSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            if (swiper.swipeDirection === "next") if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment); else swiper.slideTo(stopIndex);
            if (swiper.swipeDirection === "prev") if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + increment); else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) swiper.slideTo(rewindLastIndex); else swiper.slideTo(stopIndex);
        } else {
            if (!params.shortSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
            if (!isNavButtonTarget) {
                if (swiper.swipeDirection === "next") swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
                if (swiper.swipeDirection === "prev") swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
            } else if (e.target === swiper.navigation.nextEl) swiper.slideTo(stopIndex + increment); else swiper.slideTo(stopIndex);
        }
    }
    function onResize() {
        const swiper = this;
        const {params, el} = swiper;
        if (el && el.offsetWidth === 0) return;
        if (params.breakpoints) swiper.setBreakpoint();
        const {allowSlideNext, allowSlidePrev, snapGrid} = swiper;
        swiper.allowSlideNext = true;
        swiper.allowSlidePrev = true;
        swiper.updateSize();
        swiper.updateSlides();
        swiper.updateSlidesClasses();
        if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) swiper.slideTo(swiper.slides.length - 1, 0, false, true); else swiper.slideTo(swiper.activeIndex, 0, false, true);
        if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) swiper.autoplay.run();
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
    }
    function onClick(e) {
        const swiper = this;
        if (!swiper.enabled) return;
        if (!swiper.allowClick) {
            if (swiper.params.preventClicks) e.preventDefault();
            if (swiper.params.preventClicksPropagation && swiper.animating) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }
    }
    function onScroll() {
        const swiper = this;
        const {wrapperEl, rtlTranslate, enabled} = swiper;
        if (!enabled) return;
        swiper.previousTranslate = swiper.translate;
        if (swiper.isHorizontal()) swiper.translate = -wrapperEl.scrollLeft; else swiper.translate = -wrapperEl.scrollTop;
        if (swiper.translate === 0) swiper.translate = 0;
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (translatesDiff === 0) newProgress = 0; else newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== swiper.progress) swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
        swiper.emit("setTranslate", swiper.translate, false);
    }
    let dummyEventAttached = false;
    function dummyEventListener() {}
    const events = (swiper, method) => {
        const document = ssr_window_esm_getDocument();
        const {params, touchEvents, el, wrapperEl, device, support} = swiper;
        const capture = !!params.nested;
        const domMethod = method === "on" ? "addEventListener" : "removeEventListener";
        const swiperMethod = method;
        if (!support.touch) {
            el[domMethod](touchEvents.start, swiper.onTouchStart, false);
            document[domMethod](touchEvents.move, swiper.onTouchMove, capture);
            document[domMethod](touchEvents.end, swiper.onTouchEnd, false);
        } else {
            const passiveListener = touchEvents.start === "touchstart" && support.passiveListener && params.passiveListeners ? {
                passive: true,
                capture: false
            } : false;
            el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener);
            el[domMethod](touchEvents.move, swiper.onTouchMove, support.passiveListener ? {
                passive: false,
                capture
            } : capture);
            el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener);
            if (touchEvents.cancel) el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
        }
        if (params.preventClicks || params.preventClicksPropagation) el[domMethod]("click", swiper.onClick, true);
        if (params.cssMode) wrapperEl[domMethod]("scroll", swiper.onScroll);
        if (params.updateOnWindowResize) swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true); else swiper[swiperMethod]("observerUpdate", onResize, true);
    };
    function attachEvents() {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const {params, support} = swiper;
        swiper.onTouchStart = onTouchStart.bind(swiper);
        swiper.onTouchMove = onTouchMove.bind(swiper);
        swiper.onTouchEnd = onTouchEnd.bind(swiper);
        if (params.cssMode) swiper.onScroll = onScroll.bind(swiper);
        swiper.onClick = onClick.bind(swiper);
        if (support.touch && !dummyEventAttached) {
            document.addEventListener("touchstart", dummyEventListener);
            dummyEventAttached = true;
        }
        events(swiper, "on");
    }
    function detachEvents() {
        const swiper = this;
        events(swiper, "off");
    }
    const core_events = {
        attachEvents,
        detachEvents
    };
    const isGridEnabled = (swiper, params) => swiper.grid && params.grid && params.grid.rows > 1;
    function setBreakpoint() {
        const swiper = this;
        const {activeIndex, initialized, loopedSlides = 0, params, $el} = swiper;
        const breakpoints = params.breakpoints;
        if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return;
        const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
        if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
        const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : void 0;
        const breakpointParams = breakpointOnlyParams || swiper.originalParams;
        const wasMultiRow = isGridEnabled(swiper, params);
        const isMultiRow = isGridEnabled(swiper, breakpointParams);
        const wasEnabled = params.enabled;
        if (wasMultiRow && !isMultiRow) {
            $el.removeClass(`${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        } else if (!wasMultiRow && isMultiRow) {
            $el.addClass(`${params.containerModifierClass}grid`);
            if (breakpointParams.grid.fill && breakpointParams.grid.fill === "column" || !breakpointParams.grid.fill && params.grid.fill === "column") $el.addClass(`${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        }
        [ "navigation", "pagination", "scrollbar" ].forEach((prop => {
            const wasModuleEnabled = params[prop] && params[prop].enabled;
            const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
            if (wasModuleEnabled && !isModuleEnabled) swiper[prop].disable();
            if (!wasModuleEnabled && isModuleEnabled) swiper[prop].enable();
        }));
        const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
        const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
        if (directionChanged && initialized) swiper.changeDirection();
        utils_extend(swiper.params, breakpointParams);
        const isEnabled = swiper.params.enabled;
        Object.assign(swiper, {
            allowTouchMove: swiper.params.allowTouchMove,
            allowSlideNext: swiper.params.allowSlideNext,
            allowSlidePrev: swiper.params.allowSlidePrev
        });
        if (wasEnabled && !isEnabled) swiper.disable(); else if (!wasEnabled && isEnabled) swiper.enable();
        swiper.currentBreakpoint = breakpoint;
        swiper.emit("_beforeBreakpoint", breakpointParams);
        if (needsReLoop && initialized) {
            swiper.loopDestroy();
            swiper.loopCreate();
            swiper.updateSlides();
            swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
        }
        swiper.emit("breakpoint", breakpointParams);
    }
    function getBreakpoint(breakpoints, base, containerEl) {
        if (base === void 0) base = "window";
        if (!breakpoints || base === "container" && !containerEl) return;
        let breakpoint = false;
        const window = ssr_window_esm_getWindow();
        const currentHeight = base === "window" ? window.innerHeight : containerEl.clientHeight;
        const points = Object.keys(breakpoints).map((point => {
            if (typeof point === "string" && point.indexOf("@") === 0) {
                const minRatio = parseFloat(point.substr(1));
                const value = currentHeight * minRatio;
                return {
                    value,
                    point
                };
            }
            return {
                value: point,
                point
            };
        }));
        points.sort(((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10)));
        for (let i = 0; i < points.length; i += 1) {
            const {point, value} = points[i];
            if (base === "window") {
                if (window.matchMedia(`(min-width: ${value}px)`).matches) breakpoint = point;
            } else if (value <= containerEl.clientWidth) breakpoint = point;
        }
        return breakpoint || "max";
    }
    const breakpoints = {
        setBreakpoint,
        getBreakpoint
    };
    function prepareClasses(entries, prefix) {
        const resultClasses = [];
        entries.forEach((item => {
            if (typeof item === "object") Object.keys(item).forEach((classNames => {
                if (item[classNames]) resultClasses.push(prefix + classNames);
            })); else if (typeof item === "string") resultClasses.push(prefix + item);
        }));
        return resultClasses;
    }
    function addClasses() {
        const swiper = this;
        const {classNames, params, rtl, $el, device, support} = swiper;
        const suffixes = prepareClasses([ "initialized", params.direction, {
            "pointer-events": !support.touch
        }, {
            "free-mode": swiper.params.freeMode && params.freeMode.enabled
        }, {
            autoheight: params.autoHeight
        }, {
            rtl
        }, {
            grid: params.grid && params.grid.rows > 1
        }, {
            "grid-column": params.grid && params.grid.rows > 1 && params.grid.fill === "column"
        }, {
            android: device.android
        }, {
            ios: device.ios
        }, {
            "css-mode": params.cssMode
        }, {
            centered: params.cssMode && params.centeredSlides
        }, {
            "watch-progress": params.watchSlidesProgress
        } ], params.containerModifierClass);
        classNames.push(...suffixes);
        $el.addClass([ ...classNames ].join(" "));
        swiper.emitContainerClasses();
    }
    function removeClasses_removeClasses() {
        const swiper = this;
        const {$el, classNames} = swiper;
        $el.removeClass(classNames.join(" "));
        swiper.emitContainerClasses();
    }
    const classes = {
        addClasses,
        removeClasses: removeClasses_removeClasses
    };
    function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
        const window = ssr_window_esm_getWindow();
        let image;
        function onReady() {
            if (callback) callback();
        }
        const isPicture = dom(imageEl).parent("picture")[0];
        if (!isPicture && (!imageEl.complete || !checkForComplete)) if (src) {
            image = new window.Image;
            image.onload = onReady;
            image.onerror = onReady;
            if (sizes) image.sizes = sizes;
            if (srcset) image.srcset = srcset;
            if (src) image.src = src;
        } else onReady(); else onReady();
    }
    function preloadImages() {
        const swiper = this;
        swiper.imagesToLoad = swiper.$el.find("img");
        function onReady() {
            if (typeof swiper === "undefined" || swiper === null || !swiper || swiper.destroyed) return;
            if (swiper.imagesLoaded !== void 0) swiper.imagesLoaded += 1;
            if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
                if (swiper.params.updateOnImagesReady) swiper.update();
                swiper.emit("imagesReady");
            }
        }
        for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
            const imageEl = swiper.imagesToLoad[i];
            swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute("src"), imageEl.srcset || imageEl.getAttribute("srcset"), imageEl.sizes || imageEl.getAttribute("sizes"), true, onReady);
        }
    }
    const core_images = {
        loadImage,
        preloadImages
    };
    function checkOverflow() {
        const swiper = this;
        const {isLocked: wasLocked, params} = swiper;
        const {slidesOffsetBefore} = params;
        if (slidesOffsetBefore) {
            const lastSlideIndex = swiper.slides.length - 1;
            const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
            swiper.isLocked = swiper.size > lastSlideRightEdge;
        } else swiper.isLocked = swiper.snapGrid.length === 1;
        if (params.allowSlideNext === true) swiper.allowSlideNext = !swiper.isLocked;
        if (params.allowSlidePrev === true) swiper.allowSlidePrev = !swiper.isLocked;
        if (wasLocked && wasLocked !== swiper.isLocked) swiper.isEnd = false;
        if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? "lock" : "unlock");
    }
    const check_overflow = {
        checkOverflow
    };
    const defaults = {
        init: true,
        direction: "horizontal",
        touchEventsTarget: "wrapper",
        initialSlide: 0,
        speed: 300,
        cssMode: false,
        updateOnWindowResize: true,
        resizeObserver: true,
        nested: false,
        createElements: false,
        enabled: true,
        focusableElements: "input, select, option, textarea, button, video, label",
        width: null,
        height: null,
        preventInteractionOnTransition: false,
        userAgent: null,
        url: null,
        edgeSwipeDetection: false,
        edgeSwipeThreshold: 20,
        autoHeight: false,
        setWrapperSize: false,
        virtualTranslate: false,
        effect: "slide",
        breakpoints: void 0,
        breakpointsBase: "window",
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerGroupSkip: 0,
        slidesPerGroupAuto: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        normalizeSlideIndex: true,
        centerInsufficientSlides: false,
        watchOverflow: true,
        roundLengths: false,
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: true,
        shortSwipes: true,
        longSwipes: true,
        longSwipesRatio: .5,
        longSwipesMs: 300,
        followFinger: true,
        allowTouchMove: true,
        threshold: 0,
        touchMoveStopPropagation: false,
        touchStartPreventDefault: true,
        touchStartForcePreventDefault: false,
        touchReleaseOnEdges: false,
        uniqueNavElements: true,
        resistance: true,
        resistanceRatio: .85,
        watchSlidesProgress: false,
        grabCursor: false,
        preventClicks: true,
        preventClicksPropagation: true,
        slideToClickedSlide: false,
        preloadImages: true,
        updateOnImagesReady: true,
        loop: false,
        loopAdditionalSlides: 0,
        loopedSlides: null,
        loopedSlidesLimit: true,
        loopFillGroupWithBlank: false,
        loopPreventsSlide: true,
        rewind: false,
        allowSlidePrev: true,
        allowSlideNext: true,
        swipeHandler: null,
        noSwiping: true,
        noSwipingClass: "swiper-no-swiping",
        noSwipingSelector: null,
        passiveListeners: true,
        maxBackfaceHiddenSlides: 10,
        containerModifierClass: "swiper-",
        slideClass: "swiper-slide",
        slideBlankClass: "swiper-slide-invisible-blank",
        slideActiveClass: "swiper-slide-active",
        slideDuplicateActiveClass: "swiper-slide-duplicate-active",
        slideVisibleClass: "swiper-slide-visible",
        slideDuplicateClass: "swiper-slide-duplicate",
        slideNextClass: "swiper-slide-next",
        slideDuplicateNextClass: "swiper-slide-duplicate-next",
        slidePrevClass: "swiper-slide-prev",
        slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
        wrapperClass: "swiper-wrapper",
        runCallbacksOnInit: true,
        _emitClasses: false
    };
    function moduleExtendParams(params, allModulesParams) {
        return function extendParams(obj) {
            if (obj === void 0) obj = {};
            const moduleParamName = Object.keys(obj)[0];
            const moduleParams = obj[moduleParamName];
            if (typeof moduleParams !== "object" || moduleParams === null) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if ([ "navigation", "pagination", "scrollbar" ].indexOf(moduleParamName) >= 0 && params[moduleParamName] === true) params[moduleParamName] = {
                auto: true
            };
            if (!(moduleParamName in params && "enabled" in moduleParams)) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if (params[moduleParamName] === true) params[moduleParamName] = {
                enabled: true
            };
            if (typeof params[moduleParamName] === "object" && !("enabled" in params[moduleParamName])) params[moduleParamName].enabled = true;
            if (!params[moduleParamName]) params[moduleParamName] = {
                enabled: false
            };
            utils_extend(allModulesParams, obj);
        };
    }
    const prototypes = {
        eventsEmitter: events_emitter,
        update,
        translate,
        transition: core_transition,
        slide,
        loop,
        grabCursor: grab_cursor,
        events: core_events,
        breakpoints,
        checkOverflow: check_overflow,
        classes,
        images: core_images
    };
    const extendedDefaults = {};
    class core_Swiper {
        constructor() {
            let el;
            let params;
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
            if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === "Object") params = args[0]; else [el, params] = args;
            if (!params) params = {};
            params = utils_extend({}, params);
            if (el && !params.el) params.el = el;
            if (params.el && dom(params.el).length > 1) {
                const swipers = [];
                dom(params.el).each((containerEl => {
                    const newParams = utils_extend({}, params, {
                        el: containerEl
                    });
                    swipers.push(new core_Swiper(newParams));
                }));
                return swipers;
            }
            const swiper = this;
            swiper.__swiper__ = true;
            swiper.support = getSupport();
            swiper.device = getDevice({
                userAgent: params.userAgent
            });
            swiper.browser = getBrowser();
            swiper.eventsListeners = {};
            swiper.eventsAnyListeners = [];
            swiper.modules = [ ...swiper.__modules__ ];
            if (params.modules && Array.isArray(params.modules)) swiper.modules.push(...params.modules);
            const allModulesParams = {};
            swiper.modules.forEach((mod => {
                mod({
                    swiper,
                    extendParams: moduleExtendParams(params, allModulesParams),
                    on: swiper.on.bind(swiper),
                    once: swiper.once.bind(swiper),
                    off: swiper.off.bind(swiper),
                    emit: swiper.emit.bind(swiper)
                });
            }));
            const swiperParams = utils_extend({}, defaults, allModulesParams);
            swiper.params = utils_extend({}, swiperParams, extendedDefaults, params);
            swiper.originalParams = utils_extend({}, swiper.params);
            swiper.passedParams = utils_extend({}, params);
            if (swiper.params && swiper.params.on) Object.keys(swiper.params.on).forEach((eventName => {
                swiper.on(eventName, swiper.params.on[eventName]);
            }));
            if (swiper.params && swiper.params.onAny) swiper.onAny(swiper.params.onAny);
            swiper.$ = dom;
            Object.assign(swiper, {
                enabled: swiper.params.enabled,
                el,
                classNames: [],
                slides: dom(),
                slidesGrid: [],
                snapGrid: [],
                slidesSizesGrid: [],
                isHorizontal() {
                    return swiper.params.direction === "horizontal";
                },
                isVertical() {
                    return swiper.params.direction === "vertical";
                },
                activeIndex: 0,
                realIndex: 0,
                isBeginning: true,
                isEnd: false,
                translate: 0,
                previousTranslate: 0,
                progress: 0,
                velocity: 0,
                animating: false,
                allowSlideNext: swiper.params.allowSlideNext,
                allowSlidePrev: swiper.params.allowSlidePrev,
                touchEvents: function touchEvents() {
                    const touch = [ "touchstart", "touchmove", "touchend", "touchcancel" ];
                    const desktop = [ "pointerdown", "pointermove", "pointerup" ];
                    swiper.touchEventsTouch = {
                        start: touch[0],
                        move: touch[1],
                        end: touch[2],
                        cancel: touch[3]
                    };
                    swiper.touchEventsDesktop = {
                        start: desktop[0],
                        move: desktop[1],
                        end: desktop[2]
                    };
                    return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
                }(),
                touchEventsData: {
                    isTouched: void 0,
                    isMoved: void 0,
                    allowTouchCallbacks: void 0,
                    touchStartTime: void 0,
                    isScrolling: void 0,
                    currentTranslate: void 0,
                    startTranslate: void 0,
                    allowThresholdMove: void 0,
                    focusableElements: swiper.params.focusableElements,
                    lastClickTime: utils_now(),
                    clickTimeout: void 0,
                    velocities: [],
                    allowMomentumBounce: void 0,
                    isTouchEvent: void 0,
                    startMoving: void 0
                },
                allowClick: true,
                allowTouchMove: swiper.params.allowTouchMove,
                touches: {
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0,
                    diff: 0
                },
                imagesToLoad: [],
                imagesLoaded: 0
            });
            swiper.emit("_swiper");
            if (swiper.params.init) swiper.init();
            return swiper;
        }
        enable() {
            const swiper = this;
            if (swiper.enabled) return;
            swiper.enabled = true;
            if (swiper.params.grabCursor) swiper.setGrabCursor();
            swiper.emit("enable");
        }
        disable() {
            const swiper = this;
            if (!swiper.enabled) return;
            swiper.enabled = false;
            if (swiper.params.grabCursor) swiper.unsetGrabCursor();
            swiper.emit("disable");
        }
        setProgress(progress, speed) {
            const swiper = this;
            progress = Math.min(Math.max(progress, 0), 1);
            const min = swiper.minTranslate();
            const max = swiper.maxTranslate();
            const current = (max - min) * progress + min;
            swiper.translateTo(current, typeof speed === "undefined" ? 0 : speed);
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        emitContainerClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const cls = swiper.el.className.split(" ").filter((className => className.indexOf("swiper") === 0 || className.indexOf(swiper.params.containerModifierClass) === 0));
            swiper.emit("_containerClasses", cls.join(" "));
        }
        getSlideClasses(slideEl) {
            const swiper = this;
            if (swiper.destroyed) return "";
            return slideEl.className.split(" ").filter((className => className.indexOf("swiper-slide") === 0 || className.indexOf(swiper.params.slideClass) === 0)).join(" ");
        }
        emitSlidesClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const updates = [];
            swiper.slides.each((slideEl => {
                const classNames = swiper.getSlideClasses(slideEl);
                updates.push({
                    slideEl,
                    classNames
                });
                swiper.emit("_slideClass", slideEl, classNames);
            }));
            swiper.emit("_slideClasses", updates);
        }
        slidesPerViewDynamic(view, exact) {
            if (view === void 0) view = "current";
            if (exact === void 0) exact = false;
            const swiper = this;
            const {params, slides, slidesGrid, slidesSizesGrid, size: swiperSize, activeIndex} = swiper;
            let spv = 1;
            if (params.centeredSlides) {
                let slideSize = slides[activeIndex].swiperSlideSize;
                let breakLoop;
                for (let i = activeIndex + 1; i < slides.length; i += 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
                for (let i = activeIndex - 1; i >= 0; i -= 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
            } else if (view === "current") for (let i = activeIndex + 1; i < slides.length; i += 1) {
                const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
                if (slideInView) spv += 1;
            } else for (let i = activeIndex - 1; i >= 0; i -= 1) {
                const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
                if (slideInView) spv += 1;
            }
            return spv;
        }
        update() {
            const swiper = this;
            if (!swiper || swiper.destroyed) return;
            const {snapGrid, params} = swiper;
            if (params.breakpoints) swiper.setBreakpoint();
            swiper.updateSize();
            swiper.updateSlides();
            swiper.updateProgress();
            swiper.updateSlidesClasses();
            function setTranslate() {
                const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
                const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
                swiper.setTranslate(newTranslate);
                swiper.updateActiveIndex();
                swiper.updateSlidesClasses();
            }
            let translated;
            if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
                setTranslate();
                if (swiper.params.autoHeight) swiper.updateAutoHeight();
            } else {
                if ((swiper.params.slidesPerView === "auto" || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true); else translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
                if (!translated) setTranslate();
            }
            if (params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
            swiper.emit("update");
        }
        changeDirection(newDirection, needUpdate) {
            if (needUpdate === void 0) needUpdate = true;
            const swiper = this;
            const currentDirection = swiper.params.direction;
            if (!newDirection) newDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";
            if (newDirection === currentDirection || newDirection !== "horizontal" && newDirection !== "vertical") return swiper;
            swiper.$el.removeClass(`${swiper.params.containerModifierClass}${currentDirection}`).addClass(`${swiper.params.containerModifierClass}${newDirection}`);
            swiper.emitContainerClasses();
            swiper.params.direction = newDirection;
            swiper.slides.each((slideEl => {
                if (newDirection === "vertical") slideEl.style.width = ""; else slideEl.style.height = "";
            }));
            swiper.emit("changeDirection");
            if (needUpdate) swiper.update();
            return swiper;
        }
        changeLanguageDirection(direction) {
            const swiper = this;
            if (swiper.rtl && direction === "rtl" || !swiper.rtl && direction === "ltr") return;
            swiper.rtl = direction === "rtl";
            swiper.rtlTranslate = swiper.params.direction === "horizontal" && swiper.rtl;
            if (swiper.rtl) {
                swiper.$el.addClass(`${swiper.params.containerModifierClass}rtl`);
                swiper.el.dir = "rtl";
            } else {
                swiper.$el.removeClass(`${swiper.params.containerModifierClass}rtl`);
                swiper.el.dir = "ltr";
            }
            swiper.update();
        }
        mount(el) {
            const swiper = this;
            if (swiper.mounted) return true;
            const $el = dom(el || swiper.params.el);
            el = $el[0];
            if (!el) return false;
            el.swiper = swiper;
            const getWrapperSelector = () => `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
            const getWrapper = () => {
                if (el && el.shadowRoot && el.shadowRoot.querySelector) {
                    const res = dom(el.shadowRoot.querySelector(getWrapperSelector()));
                    res.children = options => $el.children(options);
                    return res;
                }
                if (!$el.children) return dom($el).children(getWrapperSelector());
                return $el.children(getWrapperSelector());
            };
            let $wrapperEl = getWrapper();
            if ($wrapperEl.length === 0 && swiper.params.createElements) {
                const document = ssr_window_esm_getDocument();
                const wrapper = document.createElement("div");
                $wrapperEl = dom(wrapper);
                wrapper.className = swiper.params.wrapperClass;
                $el.append(wrapper);
                $el.children(`.${swiper.params.slideClass}`).each((slideEl => {
                    $wrapperEl.append(slideEl);
                }));
            }
            Object.assign(swiper, {
                $el,
                el,
                $wrapperEl,
                wrapperEl: $wrapperEl[0],
                mounted: true,
                rtl: el.dir.toLowerCase() === "rtl" || $el.css("direction") === "rtl",
                rtlTranslate: swiper.params.direction === "horizontal" && (el.dir.toLowerCase() === "rtl" || $el.css("direction") === "rtl"),
                wrongRTL: $wrapperEl.css("display") === "-webkit-box"
            });
            return true;
        }
        init(el) {
            const swiper = this;
            if (swiper.initialized) return swiper;
            const mounted = swiper.mount(el);
            if (mounted === false) return swiper;
            swiper.emit("beforeInit");
            if (swiper.params.breakpoints) swiper.setBreakpoint();
            swiper.addClasses();
            if (swiper.params.loop) swiper.loopCreate();
            swiper.updateSize();
            swiper.updateSlides();
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            if (swiper.params.grabCursor && swiper.enabled) swiper.setGrabCursor();
            if (swiper.params.preloadImages) swiper.preloadImages();
            if (swiper.params.loop) swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true); else swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
            swiper.attachEvents();
            swiper.initialized = true;
            swiper.emit("init");
            swiper.emit("afterInit");
            return swiper;
        }
        destroy(deleteInstance, cleanStyles) {
            if (deleteInstance === void 0) deleteInstance = true;
            if (cleanStyles === void 0) cleanStyles = true;
            const swiper = this;
            const {params, $el, $wrapperEl, slides} = swiper;
            if (typeof swiper.params === "undefined" || swiper.destroyed) return null;
            swiper.emit("beforeDestroy");
            swiper.initialized = false;
            swiper.detachEvents();
            if (params.loop) swiper.loopDestroy();
            if (cleanStyles) {
                swiper.removeClasses();
                $el.removeAttr("style");
                $wrapperEl.removeAttr("style");
                if (slides && slides.length) slides.removeClass([ params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass ].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index");
            }
            swiper.emit("destroy");
            Object.keys(swiper.eventsListeners).forEach((eventName => {
                swiper.off(eventName);
            }));
            if (deleteInstance !== false) {
                swiper.$el[0].swiper = null;
                deleteProps(swiper);
            }
            swiper.destroyed = true;
            return null;
        }
        static extendDefaults(newDefaults) {
            utils_extend(extendedDefaults, newDefaults);
        }
        static get extendedDefaults() {
            return extendedDefaults;
        }
        static get defaults() {
            return defaults;
        }
        static installModule(mod) {
            if (!core_Swiper.prototype.__modules__) core_Swiper.prototype.__modules__ = [];
            const modules = core_Swiper.prototype.__modules__;
            if (typeof mod === "function" && modules.indexOf(mod) < 0) modules.push(mod);
        }
        static use(module) {
            if (Array.isArray(module)) {
                module.forEach((m => core_Swiper.installModule(m)));
                return core_Swiper;
            }
            core_Swiper.installModule(module);
            return core_Swiper;
        }
    }
    Object.keys(prototypes).forEach((prototypeGroup => {
        Object.keys(prototypes[prototypeGroup]).forEach((protoMethod => {
            core_Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
        }));
    }));
    core_Swiper.use([ Resize, Observer ]);
    const core = core_Swiper;
    function create_element_if_not_defined_createElementIfNotDefined(swiper, originalParams, params, checkProps) {
        const document = ssr_window_esm_getDocument();
        if (swiper.params.createElements) Object.keys(checkProps).forEach((key => {
            if (!params[key] && params.auto === true) {
                let element = swiper.$el.children(`.${checkProps[key]}`)[0];
                if (!element) {
                    element = document.createElement("div");
                    element.className = checkProps[key];
                    swiper.$el.append(element);
                }
                params[key] = element;
                originalParams[key] = element;
            }
        }));
        return params;
    }
    function Navigation(_ref) {
        let {swiper, extendParams, on, emit} = _ref;
        extendParams({
            navigation: {
                nextEl: null,
                prevEl: null,
                hideOnClick: false,
                disabledClass: "swiper-button-disabled",
                hiddenClass: "swiper-button-hidden",
                lockClass: "swiper-button-lock",
                navigationDisabledClass: "swiper-navigation-disabled"
            }
        });
        swiper.navigation = {
            nextEl: null,
            $nextEl: null,
            prevEl: null,
            $prevEl: null
        };
        function getEl(el) {
            let $el;
            if (el) {
                $el = dom(el);
                if (swiper.params.uniqueNavElements && typeof el === "string" && $el.length > 1 && swiper.$el.find(el).length === 1) $el = swiper.$el.find(el);
            }
            return $el;
        }
        function toggleEl($el, disabled) {
            const params = swiper.params.navigation;
            if ($el && $el.length > 0) {
                $el[disabled ? "addClass" : "removeClass"](params.disabledClass);
                if ($el[0] && $el[0].tagName === "BUTTON") $el[0].disabled = disabled;
                if (swiper.params.watchOverflow && swiper.enabled) $el[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
            }
        }
        function update() {
            if (swiper.params.loop) return;
            const {$nextEl, $prevEl} = swiper.navigation;
            toggleEl($prevEl, swiper.isBeginning && !swiper.params.rewind);
            toggleEl($nextEl, swiper.isEnd && !swiper.params.rewind);
        }
        function onPrevClick(e) {
            e.preventDefault();
            if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
            swiper.slidePrev();
            emit("navigationPrev");
        }
        function onNextClick(e) {
            e.preventDefault();
            if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
            swiper.slideNext();
            emit("navigationNext");
        }
        function init() {
            const params = swiper.params.navigation;
            swiper.params.navigation = create_element_if_not_defined_createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
                nextEl: "swiper-button-next",
                prevEl: "swiper-button-prev"
            });
            if (!(params.nextEl || params.prevEl)) return;
            const $nextEl = getEl(params.nextEl);
            const $prevEl = getEl(params.prevEl);
            if ($nextEl && $nextEl.length > 0) $nextEl.on("click", onNextClick);
            if ($prevEl && $prevEl.length > 0) $prevEl.on("click", onPrevClick);
            Object.assign(swiper.navigation, {
                $nextEl,
                nextEl: $nextEl && $nextEl[0],
                $prevEl,
                prevEl: $prevEl && $prevEl[0]
            });
            if (!swiper.enabled) {
                if ($nextEl) $nextEl.addClass(params.lockClass);
                if ($prevEl) $prevEl.addClass(params.lockClass);
            }
        }
        function destroy() {
            const {$nextEl, $prevEl} = swiper.navigation;
            if ($nextEl && $nextEl.length) {
                $nextEl.off("click", onNextClick);
                $nextEl.removeClass(swiper.params.navigation.disabledClass);
            }
            if ($prevEl && $prevEl.length) {
                $prevEl.off("click", onPrevClick);
                $prevEl.removeClass(swiper.params.navigation.disabledClass);
            }
        }
        on("init", (() => {
            if (swiper.params.navigation.enabled === false) disable(); else {
                init();
                update();
            }
        }));
        on("toEdge fromEdge lock unlock", (() => {
            update();
        }));
        on("destroy", (() => {
            destroy();
        }));
        on("enable disable", (() => {
            const {$nextEl, $prevEl} = swiper.navigation;
            if ($nextEl) $nextEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
            if ($prevEl) $prevEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
        }));
        on("click", ((_s, e) => {
            const {$nextEl, $prevEl} = swiper.navigation;
            const targetEl = e.target;
            if (swiper.params.navigation.hideOnClick && !dom(targetEl).is($prevEl) && !dom(targetEl).is($nextEl)) {
                if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
                let isHidden;
                if ($nextEl) isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass); else if ($prevEl) isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
                if (isHidden === true) emit("navigationShow"); else emit("navigationHide");
                if ($nextEl) $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
                if ($prevEl) $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
            }
        }));
        const enable = () => {
            swiper.$el.removeClass(swiper.params.navigation.navigationDisabledClass);
            init();
            update();
        };
        const disable = () => {
            swiper.$el.addClass(swiper.params.navigation.navigationDisabledClass);
            destroy();
        };
        Object.assign(swiper.navigation, {
            enable,
            disable,
            update,
            init,
            destroy
        });
    }
    function classes_to_selector_classesToSelector(classes) {
        if (classes === void 0) classes = "";
        return `.${classes.trim().replace(/([\.:!\/])/g, "\\$1").replace(/ /g, ".")}`;
    }
    function Pagination(_ref) {
        let {swiper, extendParams, on, emit} = _ref;
        const pfx = "swiper-pagination";
        extendParams({
            pagination: {
                el: null,
                bulletElement: "span",
                clickable: false,
                hideOnClick: false,
                renderBullet: null,
                renderProgressbar: null,
                renderFraction: null,
                renderCustom: null,
                progressbarOpposite: false,
                type: "bullets",
                dynamicBullets: false,
                dynamicMainBullets: 1,
                formatFractionCurrent: number => number,
                formatFractionTotal: number => number,
                bulletClass: `${pfx}-bullet`,
                bulletActiveClass: `${pfx}-bullet-active`,
                modifierClass: `${pfx}-`,
                currentClass: `${pfx}-current`,
                totalClass: `${pfx}-total`,
                hiddenClass: `${pfx}-hidden`,
                progressbarFillClass: `${pfx}-progressbar-fill`,
                progressbarOppositeClass: `${pfx}-progressbar-opposite`,
                clickableClass: `${pfx}-clickable`,
                lockClass: `${pfx}-lock`,
                horizontalClass: `${pfx}-horizontal`,
                verticalClass: `${pfx}-vertical`,
                paginationDisabledClass: `${pfx}-disabled`
            }
        });
        swiper.pagination = {
            el: null,
            $el: null,
            bullets: []
        };
        let bulletSize;
        let dynamicBulletIndex = 0;
        function isPaginationDisabled() {
            return !swiper.params.pagination.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0;
        }
        function setSideBullets($bulletEl, position) {
            const {bulletActiveClass} = swiper.params.pagination;
            $bulletEl[position]().addClass(`${bulletActiveClass}-${position}`)[position]().addClass(`${bulletActiveClass}-${position}-${position}`);
        }
        function update() {
            const rtl = swiper.rtl;
            const params = swiper.params.pagination;
            if (isPaginationDisabled()) return;
            const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
            const $el = swiper.pagination.$el;
            let current;
            const total = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
            if (swiper.params.loop) {
                current = Math.ceil((swiper.activeIndex - swiper.loopedSlides) / swiper.params.slidesPerGroup);
                if (current > slidesLength - 1 - swiper.loopedSlides * 2) current -= slidesLength - swiper.loopedSlides * 2;
                if (current > total - 1) current -= total;
                if (current < 0 && swiper.params.paginationType !== "bullets") current = total + current;
            } else if (typeof swiper.snapIndex !== "undefined") current = swiper.snapIndex; else current = swiper.activeIndex || 0;
            if (params.type === "bullets" && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
                const bullets = swiper.pagination.bullets;
                let firstIndex;
                let lastIndex;
                let midIndex;
                if (params.dynamicBullets) {
                    bulletSize = bullets.eq(0)[swiper.isHorizontal() ? "outerWidth" : "outerHeight"](true);
                    $el.css(swiper.isHorizontal() ? "width" : "height", `${bulletSize * (params.dynamicMainBullets + 4)}px`);
                    if (params.dynamicMainBullets > 1 && swiper.previousIndex !== void 0) {
                        dynamicBulletIndex += current - (swiper.previousIndex - swiper.loopedSlides || 0);
                        if (dynamicBulletIndex > params.dynamicMainBullets - 1) dynamicBulletIndex = params.dynamicMainBullets - 1; else if (dynamicBulletIndex < 0) dynamicBulletIndex = 0;
                    }
                    firstIndex = Math.max(current - dynamicBulletIndex, 0);
                    lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
                    midIndex = (lastIndex + firstIndex) / 2;
                }
                bullets.removeClass([ "", "-next", "-next-next", "-prev", "-prev-prev", "-main" ].map((suffix => `${params.bulletActiveClass}${suffix}`)).join(" "));
                if ($el.length > 1) bullets.each((bullet => {
                    const $bullet = dom(bullet);
                    const bulletIndex = $bullet.index();
                    if (bulletIndex === current) $bullet.addClass(params.bulletActiveClass);
                    if (params.dynamicBullets) {
                        if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) $bullet.addClass(`${params.bulletActiveClass}-main`);
                        if (bulletIndex === firstIndex) setSideBullets($bullet, "prev");
                        if (bulletIndex === lastIndex) setSideBullets($bullet, "next");
                    }
                })); else {
                    const $bullet = bullets.eq(current);
                    const bulletIndex = $bullet.index();
                    $bullet.addClass(params.bulletActiveClass);
                    if (params.dynamicBullets) {
                        const $firstDisplayedBullet = bullets.eq(firstIndex);
                        const $lastDisplayedBullet = bullets.eq(lastIndex);
                        for (let i = firstIndex; i <= lastIndex; i += 1) bullets.eq(i).addClass(`${params.bulletActiveClass}-main`);
                        if (swiper.params.loop) if (bulletIndex >= bullets.length) {
                            for (let i = params.dynamicMainBullets; i >= 0; i -= 1) bullets.eq(bullets.length - i).addClass(`${params.bulletActiveClass}-main`);
                            bullets.eq(bullets.length - params.dynamicMainBullets - 1).addClass(`${params.bulletActiveClass}-prev`);
                        } else {
                            setSideBullets($firstDisplayedBullet, "prev");
                            setSideBullets($lastDisplayedBullet, "next");
                        } else {
                            setSideBullets($firstDisplayedBullet, "prev");
                            setSideBullets($lastDisplayedBullet, "next");
                        }
                    }
                }
                if (params.dynamicBullets) {
                    const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
                    const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
                    const offsetProp = rtl ? "right" : "left";
                    bullets.css(swiper.isHorizontal() ? offsetProp : "top", `${bulletsOffset}px`);
                }
            }
            if (params.type === "fraction") {
                $el.find(classes_to_selector_classesToSelector(params.currentClass)).text(params.formatFractionCurrent(current + 1));
                $el.find(classes_to_selector_classesToSelector(params.totalClass)).text(params.formatFractionTotal(total));
            }
            if (params.type === "progressbar") {
                let progressbarDirection;
                if (params.progressbarOpposite) progressbarDirection = swiper.isHorizontal() ? "vertical" : "horizontal"; else progressbarDirection = swiper.isHorizontal() ? "horizontal" : "vertical";
                const scale = (current + 1) / total;
                let scaleX = 1;
                let scaleY = 1;
                if (progressbarDirection === "horizontal") scaleX = scale; else scaleY = scale;
                $el.find(classes_to_selector_classesToSelector(params.progressbarFillClass)).transform(`translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`).transition(swiper.params.speed);
            }
            if (params.type === "custom" && params.renderCustom) {
                $el.html(params.renderCustom(swiper, current + 1, total));
                emit("paginationRender", $el[0]);
            } else emit("paginationUpdate", $el[0]);
            if (swiper.params.watchOverflow && swiper.enabled) $el[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
        }
        function render() {
            const params = swiper.params.pagination;
            if (isPaginationDisabled()) return;
            const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
            const $el = swiper.pagination.$el;
            let paginationHTML = "";
            if (params.type === "bullets") {
                let numberOfBullets = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
                if (swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.loop && numberOfBullets > slidesLength) numberOfBullets = slidesLength;
                for (let i = 0; i < numberOfBullets; i += 1) if (params.renderBullet) paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass); else paginationHTML += `<${params.bulletElement} class="${params.bulletClass}"></${params.bulletElement}>`;
                $el.html(paginationHTML);
                swiper.pagination.bullets = $el.find(classes_to_selector_classesToSelector(params.bulletClass));
            }
            if (params.type === "fraction") {
                if (params.renderFraction) paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass); else paginationHTML = `<span class="${params.currentClass}"></span>` + " / " + `<span class="${params.totalClass}"></span>`;
                $el.html(paginationHTML);
            }
            if (params.type === "progressbar") {
                if (params.renderProgressbar) paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass); else paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
                $el.html(paginationHTML);
            }
            if (params.type !== "custom") emit("paginationRender", swiper.pagination.$el[0]);
        }
        function init() {
            swiper.params.pagination = create_element_if_not_defined_createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
                el: "swiper-pagination"
            });
            const params = swiper.params.pagination;
            if (!params.el) return;
            let $el = dom(params.el);
            if ($el.length === 0) return;
            if (swiper.params.uniqueNavElements && typeof params.el === "string" && $el.length > 1) {
                $el = swiper.$el.find(params.el);
                if ($el.length > 1) $el = $el.filter((el => {
                    if (dom(el).parents(".swiper")[0] !== swiper.el) return false;
                    return true;
                }));
            }
            if (params.type === "bullets" && params.clickable) $el.addClass(params.clickableClass);
            $el.addClass(params.modifierClass + params.type);
            $el.addClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
            if (params.type === "bullets" && params.dynamicBullets) {
                $el.addClass(`${params.modifierClass}${params.type}-dynamic`);
                dynamicBulletIndex = 0;
                if (params.dynamicMainBullets < 1) params.dynamicMainBullets = 1;
            }
            if (params.type === "progressbar" && params.progressbarOpposite) $el.addClass(params.progressbarOppositeClass);
            if (params.clickable) $el.on("click", classes_to_selector_classesToSelector(params.bulletClass), (function onClick(e) {
                e.preventDefault();
                let index = dom(this).index() * swiper.params.slidesPerGroup;
                if (swiper.params.loop) index += swiper.loopedSlides;
                swiper.slideTo(index);
            }));
            Object.assign(swiper.pagination, {
                $el,
                el: $el[0]
            });
            if (!swiper.enabled) $el.addClass(params.lockClass);
        }
        function destroy() {
            const params = swiper.params.pagination;
            if (isPaginationDisabled()) return;
            const $el = swiper.pagination.$el;
            $el.removeClass(params.hiddenClass);
            $el.removeClass(params.modifierClass + params.type);
            $el.removeClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
            if (swiper.pagination.bullets && swiper.pagination.bullets.removeClass) swiper.pagination.bullets.removeClass(params.bulletActiveClass);
            if (params.clickable) $el.off("click", classes_to_selector_classesToSelector(params.bulletClass));
        }
        on("init", (() => {
            if (swiper.params.pagination.enabled === false) disable(); else {
                init();
                render();
                update();
            }
        }));
        on("activeIndexChange", (() => {
            if (swiper.params.loop) update(); else if (typeof swiper.snapIndex === "undefined") update();
        }));
        on("snapIndexChange", (() => {
            if (!swiper.params.loop) update();
        }));
        on("slidesLengthChange", (() => {
            if (swiper.params.loop) {
                render();
                update();
            }
        }));
        on("snapGridLengthChange", (() => {
            if (!swiper.params.loop) {
                render();
                update();
            }
        }));
        on("destroy", (() => {
            destroy();
        }));
        on("enable disable", (() => {
            const {$el} = swiper.pagination;
            if ($el) $el[swiper.enabled ? "removeClass" : "addClass"](swiper.params.pagination.lockClass);
        }));
        on("lock unlock", (() => {
            update();
        }));
        on("click", ((_s, e) => {
            const targetEl = e.target;
            const {$el} = swiper.pagination;
            if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && $el && $el.length > 0 && !dom(targetEl).hasClass(swiper.params.pagination.bulletClass)) {
                if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
                const isHidden = $el.hasClass(swiper.params.pagination.hiddenClass);
                if (isHidden === true) emit("paginationShow"); else emit("paginationHide");
                $el.toggleClass(swiper.params.pagination.hiddenClass);
            }
        }));
        const enable = () => {
            swiper.$el.removeClass(swiper.params.pagination.paginationDisabledClass);
            if (swiper.pagination.$el) swiper.pagination.$el.removeClass(swiper.params.pagination.paginationDisabledClass);
            init();
            render();
            update();
        };
        const disable = () => {
            swiper.$el.addClass(swiper.params.pagination.paginationDisabledClass);
            if (swiper.pagination.$el) swiper.pagination.$el.addClass(swiper.params.pagination.paginationDisabledClass);
            destroy();
        };
        Object.assign(swiper.pagination, {
            enable,
            disable,
            render,
            update,
            init,
            destroy
        });
    }
    function Thumb(_ref) {
        let {swiper, extendParams, on} = _ref;
        extendParams({
            thumbs: {
                swiper: null,
                multipleActiveThumbs: true,
                autoScrollOffset: 0,
                slideThumbActiveClass: "swiper-slide-thumb-active",
                thumbsContainerClass: "swiper-thumbs"
            }
        });
        let initialized = false;
        let swiperCreated = false;
        swiper.thumbs = {
            swiper: null
        };
        function onThumbClick() {
            const thumbsSwiper = swiper.thumbs.swiper;
            if (!thumbsSwiper || thumbsSwiper.destroyed) return;
            const clickedIndex = thumbsSwiper.clickedIndex;
            const clickedSlide = thumbsSwiper.clickedSlide;
            if (clickedSlide && dom(clickedSlide).hasClass(swiper.params.thumbs.slideThumbActiveClass)) return;
            if (typeof clickedIndex === "undefined" || clickedIndex === null) return;
            let slideToIndex;
            if (thumbsSwiper.params.loop) slideToIndex = parseInt(dom(thumbsSwiper.clickedSlide).attr("data-swiper-slide-index"), 10); else slideToIndex = clickedIndex;
            if (swiper.params.loop) {
                let currentIndex = swiper.activeIndex;
                if (swiper.slides.eq(currentIndex).hasClass(swiper.params.slideDuplicateClass)) {
                    swiper.loopFix();
                    swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
                    currentIndex = swiper.activeIndex;
                }
                const prevIndex = swiper.slides.eq(currentIndex).prevAll(`[data-swiper-slide-index="${slideToIndex}"]`).eq(0).index();
                const nextIndex = swiper.slides.eq(currentIndex).nextAll(`[data-swiper-slide-index="${slideToIndex}"]`).eq(0).index();
                if (typeof prevIndex === "undefined") slideToIndex = nextIndex; else if (typeof nextIndex === "undefined") slideToIndex = prevIndex; else if (nextIndex - currentIndex < currentIndex - prevIndex) slideToIndex = nextIndex; else slideToIndex = prevIndex;
            }
            swiper.slideTo(slideToIndex);
        }
        function init() {
            const {thumbs: thumbsParams} = swiper.params;
            if (initialized) return false;
            initialized = true;
            const SwiperClass = swiper.constructor;
            if (thumbsParams.swiper instanceof SwiperClass) {
                swiper.thumbs.swiper = thumbsParams.swiper;
                Object.assign(swiper.thumbs.swiper.originalParams, {
                    watchSlidesProgress: true,
                    slideToClickedSlide: false
                });
                Object.assign(swiper.thumbs.swiper.params, {
                    watchSlidesProgress: true,
                    slideToClickedSlide: false
                });
            } else if (utils_isObject(thumbsParams.swiper)) {
                const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
                Object.assign(thumbsSwiperParams, {
                    watchSlidesProgress: true,
                    slideToClickedSlide: false
                });
                swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
                swiperCreated = true;
            }
            swiper.thumbs.swiper.$el.addClass(swiper.params.thumbs.thumbsContainerClass);
            swiper.thumbs.swiper.on("tap", onThumbClick);
            return true;
        }
        function update(initial) {
            const thumbsSwiper = swiper.thumbs.swiper;
            if (!thumbsSwiper || thumbsSwiper.destroyed) return;
            const slidesPerView = thumbsSwiper.params.slidesPerView === "auto" ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView;
            let thumbsToActivate = 1;
            const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;
            if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) thumbsToActivate = swiper.params.slidesPerView;
            if (!swiper.params.thumbs.multipleActiveThumbs) thumbsToActivate = 1;
            thumbsToActivate = Math.floor(thumbsToActivate);
            thumbsSwiper.slides.removeClass(thumbActiveClass);
            if (thumbsSwiper.params.loop || thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled) for (let i = 0; i < thumbsToActivate; i += 1) thumbsSwiper.$wrapperEl.children(`[data-swiper-slide-index="${swiper.realIndex + i}"]`).addClass(thumbActiveClass); else for (let i = 0; i < thumbsToActivate; i += 1) thumbsSwiper.slides.eq(swiper.realIndex + i).addClass(thumbActiveClass);
            const autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
            const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;
            if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
                let currentThumbsIndex = thumbsSwiper.activeIndex;
                let newThumbsIndex;
                let direction;
                if (thumbsSwiper.params.loop) {
                    if (thumbsSwiper.slides.eq(currentThumbsIndex).hasClass(thumbsSwiper.params.slideDuplicateClass)) {
                        thumbsSwiper.loopFix();
                        thumbsSwiper._clientLeft = thumbsSwiper.$wrapperEl[0].clientLeft;
                        currentThumbsIndex = thumbsSwiper.activeIndex;
                    }
                    const prevThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).prevAll(`[data-swiper-slide-index="${swiper.realIndex}"]`).eq(0).index();
                    const nextThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).nextAll(`[data-swiper-slide-index="${swiper.realIndex}"]`).eq(0).index();
                    if (typeof prevThumbsIndex === "undefined") newThumbsIndex = nextThumbsIndex; else if (typeof nextThumbsIndex === "undefined") newThumbsIndex = prevThumbsIndex; else if (nextThumbsIndex - currentThumbsIndex === currentThumbsIndex - prevThumbsIndex) newThumbsIndex = thumbsSwiper.params.slidesPerGroup > 1 ? nextThumbsIndex : currentThumbsIndex; else if (nextThumbsIndex - currentThumbsIndex < currentThumbsIndex - prevThumbsIndex) newThumbsIndex = nextThumbsIndex; else newThumbsIndex = prevThumbsIndex;
                    direction = swiper.activeIndex > swiper.previousIndex ? "next" : "prev";
                } else {
                    newThumbsIndex = swiper.realIndex;
                    direction = newThumbsIndex > swiper.previousIndex ? "next" : "prev";
                }
                if (useOffset) newThumbsIndex += direction === "next" ? autoScrollOffset : -1 * autoScrollOffset;
                if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
                    if (thumbsSwiper.params.centeredSlides) if (newThumbsIndex > currentThumbsIndex) newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1; else newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1; else if (newThumbsIndex > currentThumbsIndex && thumbsSwiper.params.slidesPerGroup === 1) ;
                    thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : void 0);
                }
            }
        }
        on("beforeInit", (() => {
            const {thumbs} = swiper.params;
            if (!thumbs || !thumbs.swiper) return;
            init();
            update(true);
        }));
        on("slideChange update resize observerUpdate", (() => {
            update();
        }));
        on("setTransition", ((_s, duration) => {
            const thumbsSwiper = swiper.thumbs.swiper;
            if (!thumbsSwiper || thumbsSwiper.destroyed) return;
            thumbsSwiper.setTransition(duration);
        }));
        on("beforeDestroy", (() => {
            const thumbsSwiper = swiper.thumbs.swiper;
            if (!thumbsSwiper || thumbsSwiper.destroyed) return;
            if (swiperCreated) thumbsSwiper.destroy();
        }));
        Object.assign(swiper.thumbs, {
            init,
            update
        });
    }
    function bildSliders() {
        let sliders = document.querySelectorAll('[class*="__swiper"]:not(.swiper-wrapper)');
        if (sliders) sliders.forEach((slider => {
            slider.parentElement.classList.add("swiper");
            slider.classList.add("swiper-wrapper");
            for (const slide of slider.children) slide.classList.add("swiper-slide");
        }));
    }
    function initSliders() {
        bildSliders();
        if (document.querySelector(".swiper")) {
            let thumbsSwiper = new core(".article__slider-thumbs:not(.eco-slider)", {
                modules: [ Navigation ],
                observer: true,
                observeParents: true,
                slidesPerView: 5,
                spaceBetween: 9,
                speed: 400,
                navigation: {
                    prevEl: ".article__swiper-button-prev",
                    nextEl: ".article__swiper-button-next"
                },
                breakpoints: {
                    420: {
                        slidesPerView: 7
                    }
                }
            });
            new core(".article__slider:not(.eco-slider)", {
                modules: [ Navigation, Thumb ],
                observer: true,
                observeParents: true,
                slidesPerView: 1,
                spaceBetween: 0,
                speed: 400,
                thumbs: {
                    swiper: thumbsSwiper
                },
                navigation: {
                    prevEl: ".article__swiper-button-prev",
                    nextEl: ".article__swiper-button-next"
                }
            });
            new core(".advice__slider", {
                modules: [ Navigation ],
                observer: true,
                observeParents: true,
                slidesPerView: 1,
                spaceBetween: 0,
                loop: true,
                speed: 400,
                navigation: {
                    prevEl: ".advice__swiper-button-prev",
                    nextEl: ".advice__swiper-button-next"
                },
                breakpoints: {
                    600: {
                        slidesPerView: 2
                    },
                    860: {
                        slidesPerView: 3
                    },
                    1190: {
                        slidesPerView: 4
                    }
                }
            });
            new core(".video-slider__slider", {
                modules: [ Navigation ],
                observer: true,
                observeParents: true,
                slidesPerView: 1,
                spaceBetween: 0,
                speed: 400,
                navigation: {
                    prevEl: ".video-slider__swiper-button-prev",
                    nextEl: ".video-slider__swiper-button-next"
                },
                breakpoints: {
                    700: {
                        slidesPerView: 3
                    },
                    530: {
                        slidesPerView: 2
                    }
                }
            });
            new core(".rec-slide__slider", {
                modules: [ Navigation, Pagination ],
                observer: true,
                observeParents: true,
                slidesPerView: 1,
                spaceBetween: 30,
                autoHeight: true,
                loop: true,
                speed: 400,
                navigation: {
                    prevEl: ".rec-slide__swiper-button-prev",
                    nextEl: ".rec-slide__swiper-button-next"
                },
                pagination: {
                    el: ".rec-slide__pagination",
                    type: "bullets",
                    clickable: true
                }
            });
            let thumbsSwiperEco = new core(".article__slider-thumbs.eco-slider", {
                modules: [ Navigation ],
                observer: true,
                observeParents: true,
                slidesPerView: 3,
                spaceBetween: 9,
                speed: 400,
                navigation: {
                    prevEl: ".eco__thumbs-control-prev",
                    nextEl: ".eco__thumbs-control-next"
                },
                breakpoints: {
                    420: {
                        slidesPerView: 5
                    },
                    1025: {
                        slidesPerView: 7
                    }
                }
            });
            new core(".article__slider.eco-slider", {
                modules: [ Navigation, Thumb ],
                observer: true,
                observeParents: true,
                slidesPerView: 1,
                spaceBetween: 0,
                speed: 400,
                thumbs: {
                    swiper: thumbsSwiperEco
                },
                navigation: {
                    prevEl: ".eco__slider-control-prev",
                    nextEl: ".eco__slider-control-next"
                }
            });
        }
    }
    window.addEventListener("load", (function(e) {
        initSliders();
    }));
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    document.addEventListener("DOMContentLoaded", (function() {
        const data = {
            data: {
                points: [ {
                    geom: "POINT(37.411004999999996 55.73859099999998)",
                    pointId: 11133,
                    address: "г. Москва, Ярцевская улица 19",
                    title: 'Пункт приема электротехники и батареек в магазине "Эльдорадо"',
                    categories: [ "BATAREJKI" ],
                    businesHoursState: {
                        allday: false,
                        schedule: [ {
                            dow: 0,
                            opens: [ "09:00" ],
                            closes: [ "22:00" ]
                        }, {
                            dow: 1,
                            opens: [ "09:00" ],
                            closes: [ "22:00" ]
                        }, {
                            dow: 2,
                            opens: [ "09:00" ],
                            closes: [ "22:00" ]
                        }, {
                            dow: 3,
                            opens: [ "09:00" ],
                            closes: [ "22:00" ]
                        }, {
                            dow: 4,
                            opens: [ "09:00" ],
                            closes: [ "22:00" ]
                        }, {
                            dow: 5,
                            opens: [ "09:00" ],
                            closes: [ "22:00" ]
                        }, {
                            dow: 6,
                            opens: [ "09:00" ],
                            closes: [ "22:00" ]
                        } ]
                    }
                }, {
                    geom: "POINT(37.463826 55.72555399999998)",
                    pointId: 11221,
                    address: "г. Москва, Славянский бульвар 13с1",
                    title: "Пункт приема электротехники и батареек в магазине Мвидео",
                    categories: [ "LAMPOCHKI" ],
                    businesHoursState: {
                        allday: true,
                        schedule: [ {
                            dow: 0,
                            opens: [ "00:00" ],
                            closes: [ "23:59" ]
                        }, {
                            dow: 1,
                            opens: [ "00:00" ],
                            closes: [ "23:59" ]
                        }, {
                            dow: 2,
                            opens: [ "00:00" ],
                            closes: [ "23:59" ]
                        }, {
                            dow: 3,
                            opens: [ "00:00" ],
                            closes: [ "23:59" ]
                        }, {
                            dow: 4,
                            opens: [ "00:00" ],
                            closes: [ "23:59" ]
                        }, {
                            dow: 5,
                            opens: [ "00:00" ],
                            closes: [ "23:59" ]
                        }, {
                            dow: 6,
                            opens: [ "00:00" ],
                            closes: [ "23:59" ]
                        } ]
                    }
                }, {
                    geom: "POINT(37.819307 55.752784)",
                    pointId: 11229,
                    address: "г. Москва, Свободный проспект 33",
                    title: "Пункт приема электротехники и батареек в магазине Мвидео",
                    categories: [ "BATAREJKI", "LAMPOCHKI" ],
                    businesHoursState: {
                        allday: false,
                        schedule: [ {
                            dow: 0,
                            opens: [ "09:00" ],
                            closes: [ "22:00" ]
                        }, {
                            dow: 1,
                            opens: [ "09:00" ],
                            closes: [ "22:00" ]
                        }, {
                            dow: 2,
                            opens: [ "09:00" ],
                            closes: [ "22:00" ]
                        }, {
                            dow: 3,
                            opens: [ "09:00" ],
                            closes: [ "22:00" ]
                        }, {
                            dow: 4,
                            opens: [ "09:00" ],
                            closes: [ "22:00" ]
                        }, {
                            dow: 5,
                            opens: [ "09:00" ],
                            closes: [ "22:00" ]
                        }, {
                            dow: 6,
                            opens: [ "09:00" ],
                            closes: [ "22:00" ]
                        } ]
                    }
                } ]
            }
        };
        const searchInput = document.querySelector(".map__input");
        const categoryRadios = document.querySelectorAll('input[name="category"]');
        const pointsContainer = document.querySelector(".map__results-blocks");
        const points = data.data.points;
        const daysOfWeek = [ "понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье" ];
        const categoryTemplates = {
            LAMPOCHKI: `\n            <div class="map__results-type map__results-type--bulb">\n\t\t\t\t\t<svg width="14px" height="20px" viewBox="0 0 450 450"\n\t\t\t\t\t\txmlns="http://www.w3.org/2000/svg">\n\t\t\t\t\t\t<path\n\t\t\t\t\t\t\td="M304,384V360c0-29,31.54-56.43,52-76,28.84-27.57,44-64.61,44-108,0-80-63.73-144-144-144A143.6,143.6,0,0,0,112,176c0,41.84,15.81,81.39,44,108,20.35,19.21,52,46.7,52,76v24"\n\t\t\t\t\t\t\tstyle="fill:none;stroke:#354147;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" />\n\t\t\t\t\t\t<line x1="224" y1="480" x2="288" y2="480"\n\t\t\t\t\t\t\tstyle="fill:none;stroke:#354147;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" />\n\t\t\t\t\t\t<line x1="208" y1="432" x2="304" y2="432"\n\t\t\t\t\t\t\tstyle="fill:none;stroke:#354147;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" />\n\t\t\t\t\t\t<line x1="256" y1="384" x2="256" y2="256"\n\t\t\t\t\t\t\tstyle="fill:none;stroke:#354147;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" />\n\t\t\t\t\t\t<path d="M294,240s-21.51,16-38,16-38-16-38-16"\n\t\t\t\t\t\t\tstyle="fill:none;stroke:#354147;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" />\n\t\t\t\t\t</svg>\n\t\t\t\t\t<span>Лампочки</span>\n\t\t\t\t</div>\n        `,
            BATAREJKI: `\n            <div class="map__results-type map__results-type--battery">\n\t\t\t\t\t<svg xmlns="http://www.w3.org/2000/svg" width="8px" height="15px"\n\t\t\t\t\t\tviewBox="0 0 34 64" version="1.1">\n\t\t\t\t\t\t<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"\n\t\t\t\t\t\t\tsketch:type="MSPage">\n\t\t\t\t\t\t\t<g id="Battery-charging" sketch:type="MSLayerGroup"\n\t\t\t\t\t\t\t\ttransform="translate(1.000000, 1.000000)" stroke="#354147"\n\t\t\t\t\t\t\t\tstroke-width="2">\n\t\t\t\t\t\t\t\t<path\n\t\t\t\t\t\t\t\t\td="M30,5 L24,5 L24,2 C24,0.9 23.1,0 22,0 L11,0 C9.9,0 9,0.9 9,2 L9,5 L2,5 C0.9,5 0,5.9 0,7 L0,60 C0,61.1 0.9,62 2,62 L30,62 C31.1,62 32,61.1 32,60 L32,7 C32,5.9 31.1,5 30,5 L30,5 Z"\n\t\t\t\t\t\t\t\t\tid="Shape" sketch:type="MSShapeGroup"></path>\n\t\t\t\t\t\t\t\t<path\n\t\t\t\t\t\t\t\t\td="M11.7,52.2 L23.2,28 L16,30.5 L19.3,13.8 L8,36.9 L15.3,33.9 L11.7,52.2 Z"\n\t\t\t\t\t\t\t\t\tid="Shape" sketch:type="MSShapeGroup"></path>\n\t\t\t\t\t\t\t</g>\n\t\t\t\t\t\t</g>\n\t\t\t\t\t</svg>\n\t\t\t\t\t<span>Батарейки</span>\n\t\t\t\t</div>\n        `
        };
        const balloonCategoryTemplates = {
            LAMPOCHKI: `\n\t\t\t\t<svg width="32px" height="40px" viewBox="0 0 450 450"\n\t\t\t\t\txmlns="http://www.w3.org/2000/svg">\n\t\t\t\t\t<path\n\t\t\t\t\t\td="M304,384V360c0-29,31.54-56.43,52-76,28.84-27.57,44-64.61,44-108,0-80-63.73-144-144-144A143.6,143.6,0,0,0,112,176c0,41.84,15.81,81.39,44,108,20.35,19.21,52,46.7,52,76v24"\n\t\t\t\t\t\tstyle="fill:none;stroke:#ffae00;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" />\n\t\t\t\t\t<line x1="224" y1="480" x2="288" y2="480"\n\t\t\t\t\t\tstyle="fill:none;stroke:#ffae00;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" />\n\t\t\t\t\t<line x1="208" y1="432" x2="304" y2="432"\n\t\t\t\t\t\tstyle="fill:none;stroke:#ffae00;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" />\n\t\t\t\t\t<line x1="256" y1="384" x2="256" y2="256"\n\t\t\t\t\t\tstyle="fill:none;stroke:#ffae00;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" />\n\t\t\t\t\t<path d="M294,240s-21.51,16-38,16-38-16-38-16"\n\t\t\t\t\t\tstyle="fill:none;stroke:#ffae00;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" />\n\t\t\t\t</svg>\n        `,
            BATAREJKI: `\n\t\t\t\t<svg xmlns="http://www.w3.org/2000/svg" width="18px" height="34px"\n\t\t\t\t\tviewBox="0 0 34 64" version="1.1">\n\t\t\t\t\t<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"\n\t\t\t\t\t\tsketch:type="MSPage">\n\t\t\t\t\t\t<g id="Battery-charging" sketch:type="MSLayerGroup"\n\t\t\t\t\t\t\ttransform="translate(1.000000, 1.000000)" stroke="#ff5a00"\n\t\t\t\t\t\t\tstroke-width="2">\n\t\t\t\t\t\t\t<path\n\t\t\t\t\t\t\t\td="M30,5 L24,5 L24,2 C24,0.9 23.1,0 22,0 L11,0 C9.9,0 9,0.9 9,2 L9,5 L2,5 C0.9,5 0,5.9 0,7 L0,60 C0,61.1 0.9,62 2,62 L30,62 C31.1,62 32,61.1 32,60 L32,7 C32,5.9 31.1,5 30,5 L30,5 Z"\n\t\t\t\t\t\t\t\tid="Shape" sketch:type="MSShapeGroup"></path>\n\t\t\t\t\t\t\t<path\n\t\t\t\t\t\t\t\td="M11.7,52.2 L23.2,28 L16,30.5 L19.3,13.8 L8,36.9 L15.3,33.9 L11.7,52.2 Z"\n\t\t\t\t\t\t\t\tid="Shape" sketch:type="MSShapeGroup"></path>\n\t\t\t\t\t\t</g>\n\t\t\t\t\t</g>\n\t\t\t\t</svg>\n        `
        };
        var myMap;
        ymaps.ready(init);
        function init() {
            myMap = new ymaps.Map("map", {
                controls: [],
                center: [ 55.751574, 37.573856 ],
                zoom: 10
            });
            let placemarks = [];
            let pointBlocks = [];
            function renderPoints(points) {
                pointsContainer.innerHTML = "";
                placemarks.forEach((placemark => myMap.geoObjects.remove(placemark)));
                placemarks = [];
                pointBlocks = [];
                points.forEach((point => {
                    let categoriesHTML = "";
                    point.categories.forEach((category => {
                        categoriesHTML += categoryTemplates[category];
                    }));
                    let balloonCategoriesHTML = "";
                    point.categories.forEach((category => {
                        balloonCategoriesHTML += balloonCategoryTemplates[category];
                    }));
                    const workTime = point.businesHoursState.allday ? `\n\t\t\t\t\t<p class="map__results-status map__results-status--green">\n\t\t\t\t\t\tкруглосуточно\n\t\t\t\t\t</p>\n\t\t\t\t` : point.businesHoursState.schedule.map((day => `\n\t\t\t\t\t\t<p class="map__results-dow">\n\t\t\t\t\t\t\t${daysOfWeek[day.dow]}: ${day.opens[0]} - ${day.closes[0]}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t\t`)).join("");
                    const pointBlock = document.createElement("div");
                    pointBlock.className = "map__results-block";
                    pointBlock.innerHTML = `\n\t\t\t\t\t<div class="map__results-block">\n\t\t\t\t\t\t<div class="map__results-types">\n\t\t\t\t\t\t\t${categoriesHTML}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<p class="map__results-block-title">\n\t\t\t\t\t\t\t${point.title}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t\t<p class="map__results-address">\n\t\t\t\t\t\t\t${point.address}\n\t\t\t\t\t\t</p>\n\t\t\t\t\t\t${workTime}\n\t\t\t\t\t</div>\n\t\t\t\t`;
                    pointsContainer.appendChild(pointBlock);
                    pointBlocks.push({
                        element: pointBlock,
                        pointId: point.pointId
                    });
                    var circleLayout = ymaps.templateLayoutFactory.createClass('<div class="circle_placemark"><div class="circle_layout"></div></div>');
                    const coords = point.geom.match(/POINT\(([\d.]+) ([\d.]+)\)/).slice(1, 3).map(Number).reverse();
                    const placemark = new ymaps.Placemark(coords, {
                        balloonContentHeader: balloonCategoriesHTML,
                        balloonContentBody: `\n\t\t\t\t\t\t\t<p class="balloon-title">${point.title}</p><br>\n\t\t\t\t\t\t`
                    }, {
                        iconLayout: circleLayout,
                        iconShape: {
                            type: "Circle",
                            coordinates: [ 0, 0 ],
                            radius: 25
                        },
                        balloonMaxWidth: 208
                    });
                    myMap.geoObjects.add(placemark);
                    placemark.pointId = point.pointId;
                    placemarks.push(placemark);
                    placemark.events.add("click", (function() {
                        highlightBlock(point.pointId);
                    }));
                    pointBlock.addEventListener("click", (function() {
                        highlightPlacemark(point.pointId, pointBlock);
                    }));
                }));
                document.querySelector(".point-number").innerText = points.length;
                if (points.length == 1) document.querySelector(".point-text").innerText = "пункт"; else if (points.length > 1 && points.length < 5) document.querySelector(".point-text").innerText = "пункта"; else document.querySelector(".point-text").innerText = "пунктов";
            }
            myMap.balloon.events.add("userclose", (function(e) {
                pointBlocks.forEach((pb => {
                    pb.element.classList.remove("_selected");
                }));
            }));
            function highlightBlock(pointId) {
                pointBlocks.forEach((pb => {
                    if (pb.pointId === pointId) {
                        pb.element.classList.add("_selected");
                        pb.element.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    } else pb.element.classList.remove("_selected");
                }));
            }
            function highlightPlacemark(pointId, pointblock) {
                pointBlocks.forEach((pb => pb.element.classList.remove("_selected")));
                placemarks.forEach((pm => {
                    if (pm.pointId === pointId) {
                        pointblock.classList.add("_selected");
                        myMap.setCenter(pm.geometry.getCoordinates(), 12, {
                            duration: 300
                        });
                        pm.balloon.open();
                    }
                }));
            }
            function filterPoints() {
                const query = searchInput.value.toLowerCase();
                const selectedCategory = document.querySelector('input[name="category"]:checked').value;
                const filteredPoints = points.filter((point => {
                    const matchesSearch = point.title.toLowerCase().includes(query) || point.address.toLowerCase().includes(query);
                    const matchesCategory = selectedCategory === "all" || point.categories.includes(selectedCategory);
                    return matchesSearch && matchesCategory;
                }));
                renderPoints(filteredPoints);
            }
            searchInput.addEventListener("input", filterPoints);
            categoryRadios.forEach((radio => radio.addEventListener("change", filterPoints)));
            renderPoints(points.filter((point => point.categories.includes("LAMPOCHKI"))));
        }
    }));
    const elem = document.querySelector(".sort--blue");
    const header = document.querySelector(".header-new");
    const headerTrigger = document.querySelector(".headerTrigger");
    window.onload = function() {
        header.classList.remove("hidden");
        if (headerTrigger) {
            let headerHeight = header.offsetHeight;
            let posTop = headerTrigger.getBoundingClientRect().top;
            header.classList.toggle("white", posTop - headerHeight <= 0);
            document.addEventListener("scroll", (function() {
                let headerHeight = header.offsetHeight;
                let posTop = headerTrigger.getBoundingClientRect().top;
                header.classList.toggle("white", posTop - headerHeight <= 0);
            }));
        }
        if (elem) {
            const vh = document.querySelectorAll(".vh");
            if (document.documentElement.clientWidth < 1051 || document.documentElement.clientHeight < 611) {
                if (vh[0].offsetHeight < window.screen.height) vh.forEach((e => {
                    e.classList.add("vhBig");
                    let vhBig = window.innerHeight * .01;
                    document.documentElement.style.setProperty("--vh", `${vhBig + .01}px`);
                }));
                if (!(vh[0].offsetHeight < window.screen.height) && !vh[0].classList.contains("vhBig")) {
                    fixedBlocks(vh, window.screen.height);
                    console.log("res");
                }
            }
            document.addEventListener("scroll", (function() {
                if (document.documentElement.clientWidth < 1051 || document.documentElement.clientHeight < 611) {
                    const height = window.screen.height;
                    if (!(vh[0].offsetHeight < height) && !vh[0].classList.contains("vhBig")) fixedBlocks(vh, height); else vh.forEach((e => {
                        e.classList.add("vhBig");
                        let vhBig = window.innerHeight * .01;
                        document.documentElement.style.setProperty("--vh", `${vhBig + .01}px`);
                    }));
                }
            }));
        }
    };
    function fixedBlocks(vh, height) {
        for (let i = 0; i < vh.length - 1; i++) {
            const vhTop = vh[i + 1].getBoundingClientRect().top;
            const newPadding = Math.ceil((vh[i].offsetHeight - vh[i + 1].offsetHeight) / 2);
            if (vh[i].offsetHeight > vh[i + 1].offsetHeight) {
                vh[i + 1].style.paddingTop = `${newPadding}px`;
                vh[i + 1].style.paddingBottom = `${newPadding}px`;
            }
            if (vhTop - height <= 0 && vhTop >= 0) {
                vh[i].classList.add("_active");
                vh[i + 1].classList.add("secBlock");
                vh[i + 1].style.marginTop = `${vh[i].offsetHeight}px`;
            } else {
                vh[i].classList.remove("_active");
                vh[i + 1].classList.remove("secBlock");
                vh[i + 1].style.marginTop = `0px`;
            }
        }
    }
    isWebp();
    menuInit();
    formFieldsInit({
        viewPass: false
    });
    formSubmit();
})();