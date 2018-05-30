function handleFile(files) {
    console.log(files[0]);
    var fileUrl;
    fileUrl = window.URL.createObjectURL(files[0]);
    destroyCurrent();
    startRadviz(fileUrl);

}