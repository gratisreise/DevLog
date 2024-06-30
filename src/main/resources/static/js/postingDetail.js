$(function () {
    let info = window.location.pathname.split("/")[2];
    let homepage = window.location.pathname.split("/")[1];
    let msg = "";
    let postId = "";
    let heartCount = 0;

    // 페이지 정보들 불러오고 조회
    $.ajax({
        url: "/api/post/detail",
        type: "post",
        data: {"info": info},
        dataType: "json",
        success: function (data) {
            postId = data[0].postId;
            $.ajax({
                url: "/api/heart/count",
                type: "get",
                data: {"postId": postId},
                success: function (data) {
                    heartCount = data;
                }
            })
            console.log("heartCount: " + heartCount)
            console.log(postId);
            console.log(data);
            $("#title").text(data[0].title);
            $("#date").text(data[0].pcreatedAt);
            console.log(data[0].postTags.length);
            if(data[0].postTags[0].tagName===null){
                $("#tagcontainer").empty()
            }
            else if(data[0].postTags.length!=0){
                for (let i = 0; i < data[0].postTags.length; i++) {
                    msg += `
                    <a class="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-base font-medium text-gray-900 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg"
                             width="32"
                             height="32"
                             viewBox="0 0 24 24"
                             fill="none"
                             stroke="currentColor"
                             stroke-width="2"
                             stroke-linecap="round"
                             stroke-linejoin="round"
                             class="w-6 h-6">
                            <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"></path>
                            <circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle>
                        </svg>
                        <span>${data[0].postTags[i].tagName}</span>
                    </a>
                    `;
                }
            $("#tagcontainer").html(msg);
            }

            $("#date").text(formatDate(data[0].pcreatedAt));
            $("#cont").html(`<div style="height: min-content; overflow: auto">${data[0].pcontent}</div>`);
            $("#home").text(homepage);
            ;

            // 댓글 목록 불러오기
            loadComments(postId);

            // 좋아요 버튼 클릭
            $("#heart").click(function () {
                $.ajax({
                    url: "/api/heart/click",
                    type: "post",
                    data: {"postId": postId},
                    success: function () {
                    }
                })
            })
            const heart = document.getElementById('heart');
            let isClicked = false; // 클릭 여부를 나타내는 변수

            heart.addEventListener('click', function () {
                if (isClicked) {
                    // 현재 클릭된 상태면 원래대로 돌아감
                    heart.innerHTML = '<i style="width: 25px;height: 25px;font-size: 25px" class="bi bi-heart"></i>';
                    heart.style.color = 'currentColor';
                } else {
                    // 현재 클릭된 상태가 아니면 변경
                    heart.innerHTML = '<i style="width: 25px;height: 25px;font-size: 25px" class="bi bi-heart-fill"></i>';
                    heart.style.color = 'red';
                }
                isClicked = !isClicked; // 클릭마다 isClicked 값을 반전
            });
        }
    });

//댓글 불러오기
    function loadComments(postId) {
        $.ajax({
            url: "/api/comment/list",
            type: "post",
            data: {"postId": postId},
            dataType: "json",
            success: function (data) {
                if (data.length != 0) {
                    let commentTableBody = $("#tbody");
                    commentTableBody.empty(); // 기존 내용을 초기화
                    data.forEach(function (item) {
                        let comment = item.comment;
                        let name = item.name;

                        let row = $("<tr class='tr1'></tr>");
                        row.append("<td class='td3'>" + name + "</td>");
                        row.append("<td class='td1'><p class='detailcomment'>" + comment.ccontent + "</p></td>");
                        row.append("<td class='td2'>" + formatDate(comment.ccreatedAt) + "</td>");

                        commentTableBody.append(row);
                    });
                } else if (data.length == 0) {
                    $(".thead1").empty();
                    $(".thead1").css("background-color", "white")
                    $(".thead1").append(`<th colspan="3">작성된 댓글이 없습니다.</th>`);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                console.error("Status:", status);
                console.dir(xhr);
            }
        });
    }

    $(".btn").click(function (e) {
        e.preventDefault();
        console.log("Button clicked"); // 디버깅을 위해 추가

        let commentData = {
            accountId: $("#accountId").val(),
            cContent: $("#cContent").val(),
            postId: postId, // postId를 직접 설정
            parentId: 1
        };

        console.log("Comment Data:", commentData); // 디버깅을 위해 추가
//댓글 작성 후 제출
        $.ajax({
            url: "/api/comment/write",
            type: "POST",
            data: JSON.stringify(commentData),
            contentType: "application/json",
            success: function () {
                alert("댓글이 저장되었습니다.");
                // 댓글 목록 다시 로드
                loadComments(postId);
                $("#cContent").val("");
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                console.error("Status:", status);
                console.dir(xhr);
            }
        });
    });


});

// 날짜 포맷 변환 함수
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    let day = date.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    let hours = date.getHours();
    if (hours < 10) {
        hours = '0' + hours;
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}
