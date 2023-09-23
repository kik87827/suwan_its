window.addEventListener("DOMContentLoaded", () => {
  commonInit();
  formItemFunc();
});
window.addEventListener("load", () => {
  layoutFunc();
  uiPickerRender();
});

/**
 * device check
 */
function commonInit() {
  let touchstart = "ontouchstart" in window;
  let userAgent = navigator.userAgent.toLowerCase();
  if (touchstart) {
    browserAdd("touchmode");
  }
  if (userAgent.indexOf('samsung') > -1) {
    browserAdd("samsung");
  }

  if (navigator.platform.indexOf('Win') > -1 || navigator.platform.indexOf('win') > -1) {
    browserAdd("window");
  }

  if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
    // iPad or iPhone
    browserAdd("ios");
  }


  function browserAdd(opt) {
    document.querySelector("html").classList.add(opt);
  }
}

/**
 * 레이아웃
 */
function layoutFunc() {

}

/**
 * menu rock
 */
function menuRock(target) {
  const targetDom = document.querySelectorAll(target);
  if (!!targetDom) {
    targetDom.forEach((item) => {
      item.classList.add("active");
    })
  }
}

function siblings(t) {
  var children = t.parentElement.children;
  var tempArr = [];

  for (var i = 0; i < children.length; i++) {
    tempArr.push(children[i]);
  }

  return tempArr.filter(function(e) {
    return e != t;
  });
}


/* popup */

/**
 * 디자인 팝업
 * @param {*} option 
 */
function DesignPopup(option) {
  this.option = option;
  this.selector = this.option.selector;

  if (this.selector !== undefined) {
    this.selector = document.querySelector(this.option.selector);
  }
  this.design_popup_wrap = document.querySelectorAll(".popup_wrap");
  this.domHtml = document.querySelector("html");
  this.domBody = document.querySelector("body");
  this.pagewrap = document.querySelector(".page_wrap");
  this.layer_wrap_parent = null;
  this.btn_closeTrigger = null;
  this.btn_close = null;
  this.bg_design_popup = null;
  this.scrollValue = 0;

  this.btn_closeTrigger = null;
  this.btn_close = null;

  const popupGroupCreate = document.createElement("div");
  popupGroupCreate.classList.add("layer_wrap_parent");

  if (!this.layer_wrap_parent && !document.querySelector(".layer_wrap_parent")) {
    this.pagewrap.append(popupGroupCreate);
  }

  this.layer_wrap_parent = document.querySelector(".layer_wrap_parent");



  // console.log(this.selector.querySelectorAll(".close_trigger"));



  this.bindEvent();
}



DesignPopup.prototype.dimCheck = function() {
  const popupActive = document.querySelectorAll(".popup_wrap.active");
  if (!!popupActive[0]) {
    popupActive[0].classList.add("active_first");
  }
  if (popupActive.length > 1) {
    this.layer_wrap_parent.classList.add("has_active_multi");
  } else {
    this.layer_wrap_parent.classList.remove("has_active_multi");
  }
}
DesignPopup.prototype.popupShow = function() {
  this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");

  if (this.selector == null) {
    return;
  }
  this.domHtml.classList.add("touchDis");

  this.selector.classList.add("active");
  setTimeout(() => {
    this.selector.classList.add("motion_end");
  }, 30);
  if ("beforeCallback" in this.option) {
    this.option.beforeCallback();
  }

  if ("callback" in this.option) {
    this.option.callback();
  }
  if (!!this.design_popup_wrap_active) {
    this.design_popup_wrap_active.forEach((element, index) => {
      if (this.design_popup_wrap_active !== this.selector) {
        element.classList.remove("active");
      }
    })
  }
  //animateIng = true;

  this.layer_wrap_parent.append(this.selector);


  this.dimCheck();

  // this.layer_wrap_parent

  // ****** 주소 해시 설정 ****** //
  // location.hash = this.selector.id
  // modalCount++
  // modalHash[modalCount] = '#' + this.selector.id
}
DesignPopup.prototype.popupHide = function() {
  var target = this.option.selector;
  if (target !== undefined) {

    this.selector.classList.remove("motion");
    if ("beforeClose" in this.option) {
      this.option.beforeClose();
    }
    //remove
    this.selector.classList.remove("motion_end");
    setTimeout(() => {

      this.selector.classList.remove("active");
    }, 400)
    this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
    this.dimCheck();
    if ("closeCallback" in this.option) {
      this.option.closeCallback();
    }
    if (this.design_popup_wrap_active.length == 1) {
      this.domHtml.classList.remove("touchDis");
    }
  }
}

DesignPopup.prototype.bindEvent = function() {
  this.btn_close = this.selector.querySelectorAll(".btn_popup_close");
  this.bg_design_popup = this.selector.querySelector(".bg_dim");
  var closeItemArray = [...this.btn_close];

  // this.selector.querySelector(".popup_content_low").addEventListener("scroll",(e)=>{
  //   console.log(this.selector.querySelector(".popup_content_low").scrollTop)
  // });

  if (!!this.btn_closeTrigger) {
    this.btn_closeTrigger = this.selector.querySelectorAll(".close_trigger");
    closeItemArray.push(...this.btn_closeTrigger)
  }
  // if (!!this.bg_design_popup) {
  //   closeItemArray.push(this.bg_design_popup);
  // }
  if (closeItemArray.length) {
    closeItemArray.forEach((element) => {
      element.addEventListener("click", (e) => {
        e.preventDefault();
        this.popupHide(this.selector);
      }, false);
    });
  }
};



/**
 * 디자인 모달
 * @param {*} option 
 */
function DesignModal(option) {
  this.title = option.title;
  this.message = option.message;
  this.domHtml = document.querySelector("html");
  this.domBody = document.querySelector("body");
  this.pagewrap = document.querySelector(".page_wrap");
  this.design_modal_wrap = null;
  this.btn_dmsmidentify = null;
  this.btn_dmsmcancel = null;
  this.duration = option.duration !== undefined ? option.duration : 400;
  this.initShow(option);
}

DesignModal.prototype.initShow = function(option) {
  var innerPublish = '';
  var objThis = this;
  let confirmPublish = option.type === "confirm" ? `<a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmcancel'>취소</a>` : ``;
  /* 
  innerPublish += "<div class='design_modal_wrap'>";
  innerPublish += "  <div class='bg_design_modal'></div>";
  innerPublish += "  <div class='design_modal_w'>";
  innerPublish += "          <div class='design_modal'>";

  innerPublish += "              <div class='design_modal_cont_w'><div class='design_modal_text'></div></div>";
  innerPublish += "              <div class='btn_dmsm_wrap'>";
  if (option.type === "confirm") {
    innerPublish += "              <a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmcancel'>취소</a>";
  }
  innerPublish += "                  <a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmidentify'>확인</a>";
  innerPublish += "              </div>";
  innerPublish += "          </div>";
  innerPublish += "  </div>";
  innerPublish += "</div>";
 */
  innerPublish = `
  <div class='design_modal_wrap'>
    <div class='design_modal_tb'>
      <div class='design_modal_td'>
        <div class='bg_design_modal'></div>
        <div class='design_modal'>
          <div class='design_modal_cont_w'>
            <div class='design_modal_maintext'></div>
            <div class='design_modal_subtext'></div>
          </div>
          <div class='btn_dmsm_wrap'>
          <a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmclose'>닫기</a>
          ${confirmPublish}
          <a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmidentify'>확인</a>
          </div>
          <a href='javascript:;' class='btn_modal_close'><span class='hdtext'>닫기</span></a>
        </div>
      </div>
    </div>
  </div>
  `;


  this.modalparent = document.createElement('div');
  this.pagewrap.appendChild(this.modalparent);
  this.modalparent.classList.add("design_modal_insert_wrap");
  this.modalparent.innerHTML = innerPublish;
  this.closetrigger = document.querySelectorAll(".close_dmtrigger");
  this.design_modal_wrap = document.querySelector(".design_modal_wrap");
  this.btn_modal_close = document.querySelector(".btn_modal_close");

  if (option.type === "confirm" || option.type === "alert") {
    this.design_modal_tit = document.querySelector(".design_modal_tit");
    this.design_modal_text = document.querySelector(".design_modal_maintext");
    this.design_modal_subtext = document.querySelector(".design_modal_subtext");
    this.btn_dmsmidentify = document.querySelector(".btn_dmsmidentify");
    this.design_modal_text.innerHTML = option.main_message;
    this.design_modal_subtext.innerHTML = option.sub_message;

  }
  if (option.type === "confirm") {
    this.btn_dmsmcancel = document.querySelector(".btn_dmsmcancel");
  }
  if (option.type === "title") {
    this.design_modal_tit.innerHTML = option.title;
  }

  this.bindEvent(option);
}
DesignModal.prototype.show = function() {
  this.pagewrap.style.zIndex = 0;
  this.domHtml.classList.add("touchDis");


  this.design_modal_wrap.classList.add("active");
  setTimeout(() => {
    this.design_modal_wrap.classList.add("motion");
  }, 30);
}
DesignModal.prototype.hide = function() {
  var objThis = this;
  this.design_modal_wrap.classList.remove("motion");
  setTimeout(function() {
    objThis.design_modal_wrap.classList.remove("active");
    document.querySelector(".design_modal_insert_wrap").remove();
    objThis.design_modal_wrap.remove();
    objThis.domHtml.classList.remove("touchDis");
  }, 530);
}
DesignModal.prototype.bindEvent = function(option) {
  var objThis = this;
  let btn_close_item = [this.btn_modal_close, ...this.closetrigger];
  btn_close_item.forEach((element, index) => {
    element.addEventListener("click", function() {
      objThis.hide();
    }, false);
  })
  if (this.btn_dmsmidentify !== null) {
    this.btn_dmsmidentify.addEventListener("click", function() {
      if (option.identify_callback !== undefined) {
        option.identify_callback();
      }
    }, false);
  }
  if (this.btn_dmsmcancel !== null) {
    this.btn_dmsmcancel.addEventListener("click", function() {
      if (option.cancel_callback !== undefined) {
        option.cancel_callback();
      }
    }, false);
  }
}


/* ui_picker_render */
function uiPickerRender() {
  const ui_picker_render = document.querySelectorAll(".ui_picker_render");
  const appBody = document.querySelector(".page_wrap");
  if (!ui_picker_render) {
    return
  }

  init();

  actionPos();
  window.addEventListener("resize", () => {
    actionPos()
  });

  function init() {
    ui_picker_render.forEach((render) => {
      if (render.classList.contains("reverse_render")) {
        return;
      }
      const thisSiblings = siblings(render);
      if (!render.classList.contains("reverse_render")) {
        thisSiblings.forEach((callItem) => {
          if (callItem.classList.contains("tui-datepicker-input")) {
            callItem.setAttribute("data-calendarcall", render.getAttribute("id"));
          }
        });
      }

      if (!!render.closest(".popup_content_low")) {
        render.closest(".popup_content_low").appendChild(render);
      } else if (!!render.closest(".screen_content_main_cols")) {
        render.closest(".screen_content_main_cols").appendChild(render);
      } else if (!!render.closest(".screen_content_sub_cols")) {
        render.closest(".screen_content_sub_cols").appendChild(render);
      } else {
        appBody.appendChild(render);
      }

      // if (render.closest(".popup_content_low") !== null) {
      //   render.closest(".popup_content_low").appendChild(render);
      // } else {
      //   appBody.appendChild(render);
      // }
    });
  }

  function actionPos() {
    ui_picker_render.forEach((render) => {
      if (render.classList.contains("reverse_render")) {
        return;
      }
      const renderLayerParent = render.closest(".popup_content_low");
      const calendarCall = document.querySelector(`[data-calendarcall='${render.getAttribute("id")}']`);
      let calendarCallLayerParentScrollTop = !!renderLayerParent ? renderLayerParent.scrollTop : 0;

      let call_top = window.scrollY + calendarCall.getBoundingClientRect().top + calendarCall.getBoundingClientRect().height;
      let calendar_layer_top = calendarCallLayerParentScrollTop + calendarCall.getBoundingClientRect().top;

      let calendar_left = calendarCall.getBoundingClientRect().left;

      if (!!render.closest(".popup_content_low")) {
        // let fullpop_contlow_top = renderLayerParent.getBoundingClientRect().top;
        // let fullpop_contlow_left = renderLayerParent.getBoundingClientRect().left;
        // render.style.top = `${(calendar_layer_top - fullpop_contlow_top) + calendarCall.getBoundingClientRect().height - 1}px`;
        // render.style.left = `${calendar_left - fullpop_contlow_left}px`;
        // render.style.width = `${calendarCall.getBoundingClientRect().width }px`;
        posItem(render, calendarCall, ".popup_content_low");
      } else if (!!render.closest(".screen_content_main_cols")) {
        posItem(render, calendarCall, ".screen_content_main_cols");
      } else if (!!render.closest(".screen_content_sub_cols")) {
        posItem(render, calendarCall, ".screen_content_sub_cols");
      } else {
        render.style.top = `${call_top}px`;
        render.style.left = `${calendar_left}px`;
        render.style.width = `${calendarCall.getBoundingClientRect().width}px`;
      }

    });


    function posItem(render, caller, parent) {
      let renderLayerParent = !!render.closest(parent) ? render.closest(parent) : null;
      let parent_contlow_top = renderLayerParent.getBoundingClientRect().top;
      let parent_contlow_left = renderLayerParent.getBoundingClientRect().left;
      let child_caller_top = !!renderLayerParent ? renderLayerParent.scrollTop + caller.getBoundingClientRect().top : 0;
      let child_caller_left = caller.getBoundingClientRect().left;

      render.style.top = `${(child_caller_top - parent_contlow_top) + caller.getBoundingClientRect().height - 1}px`;
      render.style.left = `${child_caller_left - parent_contlow_left}px`;
      render.style.width = `${ caller.getBoundingClientRect().width }px`;
    }
  }
}
/* 검색 */



function formItemFunc() {
  const form_select = document.querySelectorAll(".form_select");
  if (!!form_select) {
    form_select.forEach((item) => {
      if (item.value !== "0") {
        item.classList.add("filled");
      } else {
        item.classList.remove("filled");
      }
    })
  }

  //input
  addDynamicEventListener(document.body, 'focusin', '.form_input', function(e) {
    const thisTarget = e.target;
    thisTarget.classList.add("focus");
  });
  // addDynamicEventListener(document.body, 'input', '.form_input', function(e) {
  //   const thisTarget = e.target;
  //   thisTarget.classList.add("focus");
  //   if(thisTarget.value.length){
  //     thisTarget.classList.add("typing");
  //   }else{
  //     thisTarget.classList.remove("typing");
  //   }
  // });
  addDynamicEventListener(document.body, 'focusout', '.form_input', function(e) {
    const thisTarget = e.target;
    thisTarget.classList.remove("focus");
  });

  //select
  addDynamicEventListener(document.body, 'click', '.form_select', function(e) {
    const thisTarget = e.target;
    selectReset();
    thisTarget.classList.add("focus");
  });
  addDynamicEventListener(document.body, 'change', '.form_select', function(e) {
    const thisTarget = e.target;

    if (thisTarget.value !== "0") {
      console.log(thisTarget.value);
      thisTarget.classList.add("filled");
    } else {
      thisTarget.classList.remove("filled");
    }

    setTimeout(() => {
      thisTarget.classList.remove("focus");
    }, 10);
  });
  let currentScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    if (currentScrollY !== window.scrollY) {
      selectReset();
    }
    currentScrollY = window.scrollY
  });
  document.querySelector("body").addEventListener("click", (e) => {
    if (e.target.classList.contains("form_select")) {
      return;
    }
    selectReset();
  });

  function selectReset() {
    const selectDom = document.querySelectorAll(".form_select");
    if (!!selectDom) {
      selectDom.forEach((item) => {
        item.classList.remove("focus");
      });
    }
  }
}