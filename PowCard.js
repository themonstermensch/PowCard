class PowCard extends Application {

    constructor() {
        super();
    }

    static get defaultOptions() {
        const options = super.defaultOptions; 
        options.template = "modules/PowCard/templates/PowCard.html";
        options.title = "PowCard.WindowTitle";
        options.id = "PowCard";
        options.resizable = false;
        if (game.settings.get("PowCard","imageToggle")){
            options.height = game.settings.get("PowCard","imageSize").height+75;
            options.width = game.settings.get("PowCard","imageSize").width+50;
        } else {
            options.height="auto";
            options.width="auto";
        }
        return options;
    }

    async getData() {
        const imageToggle = game.settings.get("PowCard", "imageToggle");
        const imagePath = game.settings.get("PowCard", "imagePath");

        let imageWidth = 0;
        let imageHeight = 0;
        if (imageToggle) {
            const tex = await loadTexture(imagePath);
            imageWidth = tex.width;
            imageHeight = tex.height;
        }

        return {
            imageToggle: imageToggle,
            imagePath: imagePath,
            imageWidth: imageWidth,
            imageHeight: imageHeight
        }
    }
}

Hooks.on('getSceneControlButtons', function(hudButtons)
{
    let hud = hudButtons.find(val => { return val.name == "token"; })
    if (hud) {
        hud.tools.push({
            name: "PowCard.ButtonName",
            title: "PowCard.ButtonHint",
            icon: game.i18n.localize("PowCard.ButtonFAIcon"),
            button: true,
            onClick: async () => {
                let pc = new PowCard();
                pc.render(true);
                game.socket.emit("module.PowCard", {"event": "PowCard"})
            }
        });
    }
});

Hooks.once('ready', async function () {

    game.socket.on("module.PowCard", data => {
        let pc = new PowCard();
        pc.render(true);
    });

    game.settings.register("PowCard", "imageToggle", {
        name: "PowCard.Settings.ImageToggleName",
        hint: "PowCard.Settings.ImageToggleHint",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });

    game.settings.register("PowCard", "imageSize", {
        config: false,
        type:Object,
        default:{"width":300,"height":500}
    })

    game.settings.register("PowCard", "imagePath", {
        name: "PowCard.Settings.ImagePathName",
        hint: "PowCard.Settings.ImagePathHint",
        scope: "world",
        config: true,
        type: String,
        default:"",
        onChange: async value => {
            const tex = await loadTexture(value);
            imageWidth = tex.width;
            imageHeight = tex.height;
            await game.settings.set("PowCard", "imageSize",{"width":imageWidth,"height":imageHeight});
        }
    });

    if (game.settings.get("PowCard","imageToggle")){
        const tex = await loadTexture(game.settings.get("PowCard","imagePath"));
            imageWidth = tex.width;
            imageHeight = tex.height;
            await game.settings.set("PowCard", "imageSize",{"width":imageWidth,"height":imageHeight});
    }

});
