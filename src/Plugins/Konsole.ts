export default function konsole(k) 
{
    let consoleActive = false;
    let consoleInitialized = false;
    const commandHistory = [];
    const logs = [];
    const commands: Record<string, (params: any) => void> = {};

    function createConsoleBody()
    {
        const c = k.add([
            k.pos(k.center()),
            k.rect(k.width() - 64, k.height() - 64, {
                radius: 32,
            }),
            k.color(k.BLACK),
            k.opacity(0.75),
            k.anchor("center"),
            k.z(1000),
        ]);
        c.add([
            k.rect(k.width() - 64, k.height() - 64, {
                radius: 32,
                fill: false,
            }),
            k.anchor("center"),
            k.outline(6, k.WHITE, 1),
        ]);

        const inputCommand = c.add([
            k.pos(-c.width / 2 + 16, c.height / 2 - 48),
            k.text("", {
                width: c.width - 48,
                size: 32
            }),
            k.textInput(true),
            k.anchor("left"),
        ]);

        const textLog = c.add([
            k.pos(-c.width / 2 + 64, -c.height / 2 + 48),
            k.text("oh hi", {
                align: "left",
                styles: {
                    "info": {
                        color: k.rgb(100, 100, 100)
                    },
                    "error": {
                        color: k.rgb(204, 66, 94)
                    },
                    "warn": {
                        color: k.rgb(255, 184, 121)
                    },
                },
            }),
        ]);

        return c;
    }

    function updateLogDisplay(c)
    {
        const display = c.children[2];
        if (logs.length > 12)
            logs.shift();
        
        display.text = "";

        logs.forEach((e, i, a) => {
            display.text += e + "\n";
        })
    }

    function logString(...msg: any)
    {
        if (!consoleInitialized)
            return;

        const textdata = msg.toString();
        logs.push(`[info](INFO) ${textdata}[/info]`);
        return;
    }

    function logWarn(...msg: any)
    {
        if (!consoleInitialized)
            return;

        const textdata = msg.toString();
        logs.push(`[warn](WARN) ${textdata}[/warn]`);
        return;
    }

    function logError(...msg: any)
    {
        if (!consoleInitialized)
            return;

        const textdata = msg.toString();
        logs.push(`[error](ERROR) ${textdata}[/error]`);
        return;
    }

    function parseCommand(text: string)
    {
        const tokens = text.split(" ");
        const currentCommand = tokens.shift();
        console.log(currentCommand);

        if (commands[currentCommand] == null)
        {
            logError("Invalid command");
            return;
        }

        commands[currentCommand](tokens);
    }

    let consoleBody;

    return {
        init()
        {
            for(let i = logs.length; i > 0; i--)
                logs.splice(i, 1);

            consoleBody = createConsoleBody();

            consoleBody.paused = true;
            consoleBody.hidden = true;

            k.onUpdate(() => {
                updateLogDisplay(consoleBody);
            });

            k.onKeyPress((key) => {
                if (key == "`")
                {
                    consoleActive = !consoleActive;

                    consoleBody.hidden = !consoleActive;
                    consoleBody.paused = !consoleActive;
                    if (consoleActive)
                    {
                        consoleBody.children[1].text = "";
                        consoleBody.children[1].typedText = "";
                    }
                }

                if (!consoleActive)
                    return;

                if (key == "enter")
                {
                    const txt = consoleBody.children[1];
                    commandHistory.push(txt.typedText);
                    logs.push(txt.typedText);
                    parseCommand(txt.typedText);
                    txt.text = "";
                    txt.typedText = "";
                }
            });

            consoleInitialized = true;
        },

        logString: logString,

        logWarn: logWarn,

        logError: logError,

        addCommand(name: string, action: (params: any) => void)
        {
            if (!consoleInitialized)
                return;

            if (commands[name] == null)
                commands[name] = action;
        }
    };
}