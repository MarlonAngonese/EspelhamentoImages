let ctx = $('#imgbox')[0].getContext('2d');
var size = 0;
// Carrega Imagem e envia para o canvas
$('#inputfile').change(function (e) { 
    e.preventDefault();
    
    reader = new FileReader();
    reader.readAsDataURL(this.files[0]);

    reader.onload = () => {
        let img = new Image();
        img.src = reader.result;

        let size = 0;

        img.onload = async () => {
            // Função assíncrona para retornar o tamanho de uma imagem
            function imageSize(url) {
                const imgX = document.createElement("img");

                const promise = new Promise((resolve, reject) => {
                    imgX.onload = () => {
                        const width  = imgX.naturalWidth;
                        const height = imgX.naturalHeight; 

                        resolve({width, height});
                    };

                    imgX.onerror = reject;
                });

                imgX.src = url;

                return promise;
            }

            const getSize = async (src) => {
                const imageDimensions = await imageSize(src);

                return imageDimensions;
            }

            size = await getSize(img.src);
        }

        setTimeout(() => {
            $('#imgbox')[0].width = size.width * 2;
            $('#imgbox')[0].height = size.height;
            ctx.drawImage(img, 0, 0, $('#imgbox')[0].width / 2, $('#imgbox')[0].height);
            let imageDataA = ctx.getImageData(0, 0, $('#imgbox')[0].width / 2, $('#imgbox')[0].height);
            
            mirrorImage(ctx, img, 0, 0, true, false);
        }, 100);

    }
});

function mirrorImage(ctx, image, x = 0, y = 0, horizontal = false, vertical = false){
    ctx.save();
    ctx.setTransform(-1, 0, 0, 1,x + (image.width), y);
    ctx.drawImage(image, -$('#imgbox')[0].width / 2, 0);
    ctx.restore();
}