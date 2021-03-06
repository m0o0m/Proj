(function(b) {
	b.fn.zclip = function(d) {
		if (typeof d == "object" && !d.length) {
			var a = b.extend({
				path: "ZeroClipboard.swf",
				copy: null,
				beforeCopy: null,
				afterCopy: null,
				clickAfter: true,
				setHandCursor: true,
				setCSSEffects: true
			},
			d);
			return this.each(function() {
				var c = b(this);
				if (c.is(":visible") && (typeof a.copy == "string" || b.isFunction(a.copy))) {
					ZeroClipboard.setMoviePath(a.path);
					var f = new ZeroClipboard.Client();
					if (b.isFunction(a.copy)) {
						c.bind("zClip_copy", a.copy);
					}
					if (b.isFunction(a.beforeCopy)) {
						c.bind("zClip_beforeCopy", a.beforeCopy);
					}
					if (b.isFunction(a.afterCopy)) {
						c.bind("zClip_afterCopy", a.afterCopy);
					}
					f.setHandCursor(a.setHandCursor);
					f.setCSSEffects(a.setCSSEffects);
					f.addEventListener("mouseOver",
					function(e) {
						c.trigger("mouseenter");
					});
					f.addEventListener("mouseOut",
					function(e) {
						c.trigger("mouseleave");
					});
					f.addEventListener("mouseDown",
					function(e) {
						c.trigger("mousedown");
						if (!b.isFunction(a.copy)) {
							f.setText(a.copy);
						} else {
							f.setText(c.triggerHandler("zClip_copy"));
						}
						if (b.isFunction(a.beforeCopy)) {
							c.trigger("zClip_beforeCopy");
						}
					});
					f.addEventListener("complete",
					function(h, e) {
						if (b.isFunction(a.afterCopy)) {
							c.trigger("zClip_afterCopy");
						} else {
							if (e.length > 500) {
								e = e.substr(0, 500) + "...\n\n(" + (e.length - 500) + " characters not shown)";
							}
							c.removeClass("hover");
							$.msg("复制成功:你可以使用Ctrl+V 贴到需要的地方去了哦！ \n\n " + e,1);
						}
						if (a.clickAfter) {
							c.trigger("click");
						}
					});
					f.glue(c[0], c.parent()[0]);
					b(window).bind("load resize",
					function() {
						f.reposition();
					});
				}
			});
		} else {
			if (typeof d == "string") {
				return this.each(function() {
					var c = b(this);
					d = d.toLowerCase();
					var g = c.data("zclipId");
					var h = b("#" + g + ".zclip");
					if (d == "remove") {
						h.remove();
						c.removeClass("active hover");
					} else {
						if (d == "hide") {
							h.hide();
							c.removeClass("active hover");
						} else {
							if (d == "show") {
								h.show();
							}
						}
					}
				});
			}
		}
	};
})(jQuery);
var ZeroClipboard = {
	version: "1.0.7",
	clients: {},
	moviePath: "ZeroClipboard.swf",
	nextId: 1,
	$: function(b) {
		if (typeof(b) == "string") {
			b = document.getElementById(b);
		}
		if (!b.addClass) {
			b.hide = function() {
				this.style.display = "none";
			};
			b.show = function() {
				this.style.display = "";
			};
			b.addClass = function(a) {
				this.removeClass(a);
				this.className += " " + a;
			};
			b.removeClass = function(g) {
				var f = this.className.split(/\s+/);
				var a = -1;
				for (var h = 0; h < f.length; h++) {
					if (f[h] == g) {
						a = h;
						h = f.length;
					}
				}
				if (a > -1) {
					f.splice(a, 1);
					this.className = f.join(" ");
				}
				return this;
			};
			b.hasClass = function(a) {
				return !! this.className.match(new RegExp("\\s*" + a + "\\s*"));
			};
		}
		return b;
	},
	setMoviePath: function(b) {
		this.moviePath = b;
	},
	dispatch: function(g, e, h) {
		var f = this.clients[g];
		if (f) {
			f.receiveEvent(e, h);
		}
	},
	register: function(c, d) {
		this.clients[c] = d;
	},
	getDOMObjectPosition: function(f, e) {
		var d = {
			left: 0,
			top: 0,
			width: f.width ? f.width: f.offsetWidth,
			height: f.height ? f.height: f.offsetHeight
		};
		if (f && (f != e)) {
			d.left += f.offsetLeft;
			d.top += f.offsetTop;
		}
		return d;
	},
	Client: function(b) {
		this.handlers = {};
		this.id = ZeroClipboard.nextId++;
		this.movieId = "ZeroClipboardMovie_" + this.id;
		ZeroClipboard.register(this.id, this);
		if (b) {
			this.glue(b);
		}
	}
};
ZeroClipboard.Client.prototype = {
	id: 0,
	ready: false,
	movie: null,
	clipText: "",
	handCursorEnabled: true,
	cssEffects: true,
	handlers: null,
	glue: function(k, g, j) {
		this.domElement = ZeroClipboard.$(k);
		var i = 99;
		if (this.domElement.style.zIndex) {
			i = parseInt(this.domElement.style.zIndex, 10) + 1;
		}
		if (typeof(g) == "string") {
			g = ZeroClipboard.$(g);
		} else {
			if (typeof(g) == "undefined") {
				g = document.getElementsByTagName("body")[0];
			}
		}
		var l = ZeroClipboard.getDOMObjectPosition(this.domElement, g);
		this.div = document.createElement("div");
		this.div.className = "zclip";
		this.div.id = "zclip-" + this.movieId;
		$(this.domElement).data("zclipId", "zclip-" + this.movieId);
		var h = this.div.style;
		h.position = "absolute";
		h.left = "" + l.left + "px";
		h.top = "" + l.top + "px";
		h.width = "" + l.width + "px";
		h.height = "" + l.height + "px";
		h.zIndex = i;
		if (typeof(j) == "object") {
			for (addedStyle in j) {
				h[addedStyle] = j[addedStyle];
			}
		}
		g.appendChild(this.div);
		this.div.innerHTML = this.getHTML(l.width, l.height);
	},
	getHTML: function(i, g) {
		var j = "";
		var f = "id=" + this.id + "&width=" + i + "&height=" + g;
		if (navigator.userAgent.match(/MSIE/)) {
			var h = location.href.match(/^https/i) ? "https://": "http://";
			j += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + h + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + i + '" height="' + g + '" id="' + this.movieId + '" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + ZeroClipboard.moviePath + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + f + '"/><param name="wmode" value="transparent"/></object>';
		} else {
			j += '<embed id="' + this.movieId + '" src="' + ZeroClipboard.moviePath + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + i + '" height="' + g + '" name="' + this.movieId + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + f + '" wmode="transparent" />';
		}
		return j;
	},
	hide: function() {
		if (this.div) {
			this.div.style.left = "-2000px";
		}
	},
	show: function() {
		this.reposition();
	},
	destroy: function() {
		if (this.domElement && this.div) {
			this.hide();
			this.div.innerHTML = "";
			var d = document.getElementsByTagName("body")[0];
			try {
				d.removeChild(this.div);
			} catch(c) {}
			this.domElement = null;
			this.div = null;
		}
	},
	reposition: function(f) {
		if (f) {
			this.domElement = ZeroClipboard.$(f);
			if (!this.domElement) {
				this.hide();
			}
		}
		if (this.domElement && this.div) {
			var d = ZeroClipboard.getDOMObjectPosition(this.domElement);
			var e = this.div.style;
			e.left = "" + d.left + "px";
			e.top = "" + d.top + "px";
		}
	},
	setText: function(b) {
		this.clipText = b;
		if (this.ready) {
			this.movie.setText(b);
		}
	},
	addEventListener: function(d, c) {
		d = d.toString().toLowerCase().replace(/^on/, "");
		if (!this.handlers[d]) {
			this.handlers[d] = [];
		}
		this.handlers[d].push(c);
	},
	setHandCursor: function(b) {
		this.handCursorEnabled = b;
		if (this.ready) {
			this.movie.setHandCursor(b);
		}
	},
	setCSSEffects: function(b) {
		this.cssEffects = !!b;
	},
	receiveEvent: function(m, l) {
		m = m.toString().toLowerCase().replace(/^on/, "");
		switch (m) {
		case "load":
			this.movie = document.getElementById(this.movieId);
			if (!this.movie) {
				var n = this;
				setTimeout(function() {
					n.receiveEvent("load", null);
				},
				1);
				return
			}
			if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
				var n = this;
				setTimeout(function() {
					n.receiveEvent("load", null);
				},
				100);
				this.ready = true;
				return
			}
			this.ready = true;
			try {
				this.movie.setText(this.clipText);
			} catch(j) {}
			try {
				this.movie.setHandCursor(this.handCursorEnabled);
			} catch(j) {}
			break;
		case "mouseover":
			if (this.domElement && this.cssEffects) {
				this.domElement.addClass("hover");
				if (this.recoverActive) {
					this.domElement.addClass("active");
				}
			}
			break;
		case "mouseout":
			if (this.domElement && this.cssEffects) {
				this.recoverActive = false;
				if (this.domElement.hasClass("active")) {
					this.domElement.removeClass("active");
					this.recoverActive = true;
				}
				this.domElement.removeClass("hover");
			}
			break;
		case "mousedown":
			if (this.domElement && this.cssEffects) {
				this.domElement.addClass("active");
			}
			break;
		case "mouseup":
			if (this.domElement && this.cssEffects) {
				this.domElement.removeClass("active");
				this.recoverActive = false;
			}
			break;
		}
		if (this.handlers[m]) {
			for (var e = 0,
			i = this.handlers[m].length; e < i; e++) {
				var k = this.handlers[m][e];
				if (typeof(k) == "function") {
					k(this, l);
				} else {
					if ((typeof(k) == "object") && (k.length == 2)) {
						k[0][k[1]](this, l);
					} else {
						if (typeof(k) == "string") {
							window[k](this, l);
						}
					}
				}
			}
		}
	}
};
$(function() {
	$("#clipinner1").zclip({
		path: "/js/ZeroClipboard.swf",
		copy: function() {
			var cardNum = $("#showBankCard").val();
			if(cardNum == '' || cardNum.length <=0){
				$.msg('请选择银行后再点击复制银行信息。',3);
				return;
			}
			return cardNum;
		}
	});
	$("#clipinner2").zclip({
		path: "/js/ZeroClipboard.swf",
		copy: function() {
			var bankPerson = $("#bankPerson").val();
			if(bankPerson == '' || bankPerson.length <=0){
				$.msg('请选择银行后再点击复制银行信息。',3);
				return;
			}
			return bankPerson;
		}
	});
	$("#clipinner3").zclip({
		path: "/js/ZeroClipboard.swf",
		copy: function() {
			var bankPerson = $("#ordernumber").val();
			if(bankPerson == '' || bankPerson.length <=0){
				$.msg('当前订单号为空,请刷新重试。',3);
				return;
			}
			return bankPerson;
		}
	});
});