/*
 * @Author: ecitlm
 * @Date:   2017-09-22 23:15:16
 * @Last Modified by:   ecitlm
 * @Last Modified time: 2017-09-24 14:09:24
 */
(function(win, doc) {
	var Tools = {

		//id或class选择器$("elem") 
		$: function(strExpr) {
			var idExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
			var classExpr = /^(?:\s*(<[\w\W]+>)[^>]*|.([\w-]*))$/;
			if (idExpr.test(strExpr)) {
				var idMatch = idExpr.exec(strExpr);
				return document.getElementById(idMatch[2]);
			} else if (classExpr.test(strExpr)) {
				var classMatch = classExpr.exec(strExpr);
				var allElement = document.getElementsByTagName("*");
				var ClassMatch = [];
				for (var i = 0, l = allElement.length; i < l; i++) {
					if (allElement[i].className.match(new RegExp("(\\s|^)" + classMatch[2] + "(\\s|$)"))) {
						ClassMatch.push(allElement[i]);
					}
				}
				return ClassMatch;
			}
		},
		//ajax
		ajax: function() {
			var ajaxData = {
				type: arguments[0].type || "GET",
				url: arguments[0].url || "",
				async: arguments[0].async || "true",
				data: arguments[0].data || null,
				dataType: arguments[0].dataType || "text",
				contentType: arguments[0].contentType || "application/x-www-form-urlencoded",
				beforeSend: arguments[0].beforeSend || function() {},
				success: arguments[0].success || function() {},
				error: arguments[0].error || function() {}
			}
			ajaxData.beforeSend()
			var xhr = createxmlHttpRequest();
			xhr.responseType = ajaxData.dataType;
			xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);
			xhr.setRequestHeader("Content-Type", ajaxData.contentType);
			xhr.send(convertData(ajaxData.data));
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						ajaxData.success(xhr.response)
					} else {
						ajaxData.error()
					}
				}
			}

			function createxmlHttpRequest() {
				if (window.ActiveXObject) {
					return new ActiveXObject("Microsoft.XMLHTTP");
				} else if (window.XMLHttpRequest) {
					return new XMLHttpRequest();
				}
			}

			function convertData(data) {
				if (typeof data === 'object') {
					var convertResult = "";
					for (var c in data) {
						convertResult += c + "=" + data[c] + "&";
					}
					convertResult = convertResult.substring(0, convertResult.length - 1)
					return convertResult;
				} else {
					return data;
				}
			}
		},
		//生成随机数
		getRandom: function(num) {
			var random = "";
			for (var i = 0; i < num; i++) {
				random += Math.floor(Math.random() * 10)
			}
			return random
		},
		//得到URL的参数
		getParams: function(url) {
			url = url.substring(url.indexOf('?') + 1);
			var obj = {};
			if (url) {
				arr = url.split("&");
				for (var i in arr) {
					obj[arr[i].split('=')[0]] = encodeURI(arr[i].split('=')[1].split("#")[0]);
				};
			};
			return obj;
		},

		//url 序列化
		//urlParam({a:1,b:2,c:'hello'}) //a=1&b=2&c=hello
		urlParam: function(obj) {
			var arr = [];
			for (var k in obj) {
				if (obj[k] != null && obj[k] != '') {
					arr.push(k + '=' + obj[k])
				}
			}
			return arr.join('&');
		}

	}
	window.Tools = Tools
})(window, document)