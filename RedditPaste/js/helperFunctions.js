function processLinks() {
    var posts = $("div.sitetable > .link");
    $.each(posts, function (i, v) {
        var payload = {
          'content': $(this).find("div.entry > p.title > a").attr('href'),
          'text': $(this).find("div.entry > p.title > a").text(),
          'commentUrl': $(this).find("a.comments").first().attr('href'),
          'isProcessed': $(this).find("div.entry > ul.buttons > li > a.copyToCB").length
        };

        if (!payload.isProcessed) {
            if (stringStartsWith(payload.content, '/r/')) {
                payload.content = window.location.origin + payload.content;
            }

            var cbLink = "<a style=\"cursor: pointer\" class=\"copyToCB\" data-commenturl=\""+payload.commentUrl+"\" data-href=\"" + payload.content + "\" data-text=\"" + payload.text + "\">clipboard</a>"
            $(this).find("div.entry > ul.flat-list").append("<li>"+cbLink+"</li>");
        }
    });
    myClickBinding($(".copyToCB"), "copyToCBClick");
}

function copyToClipboard(text) {
    const input = document.createElement('textarea');
    input.style.position = 'fixed';
    input.style.opacity = 0;
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('Copy');
    document.body.removeChild(input);
}

function notifyMe(payload) {
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.');
        return;
    }

    if (Notification.permission !== "granted")
        Notification.requestPermission();

    else {
        var notification = new Notification("Copied to Clipboard", {
            // icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
            body: payload.linktext
        });

        setTimeout(function () {
            notification.close();
        }, 2000);
    }
}

function stringStartsWith (string, prefix) {
    return string.slice(0, prefix.length) == prefix;
}

function myClickBinding(jqEle, namespace) {
    jqEle.unbind('click.'+namespace).bind('click.'+namespace, function() {
        var payload = {
          'linktext': $(this).data('text'),
          'content': $(this).data('href'),
          'commenturl': $(this).data('commenturl'),
        };

        if (payload.content == payload.commenturl) {
            var message = $(this).data('text') + "\n\n" + $(this).data('href');
        } else {
            var message = $(this).data('text') + "\n\n" + $(this).data('href') + "\n" + $(this).data('commenturl');
        }

        copyToClipboard(message);
        notifyMe(payload);
    });
};
