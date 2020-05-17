let c_path = "<%=locals.asset_path('images/back.jpg')%>"
let path = `D:/backend/nodews/codial/public/assets${c_path}`
console.log("kkkkkkkkkkkkk", `${path}`);
// $("#main-body").css("background-image", "url('
//         <%=locals.asset_path('images/back.jpg')%>
//         ')")
$('#main-body').css('background-images', 'url(`${path}`)');