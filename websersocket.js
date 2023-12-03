import {
    f_websersocket_serve, 
    f_v_before_return_response__fileserver
} from "https://deno.land/x/websersocket@0.2/mod.js"

let s_path_file_current = new URL(import.meta.url).pathname;
let s_path_folder_current = s_path_file_current.split('/').slice(0, -1).join('/'); 
// console.log(s_path_folder_current)

await f_websersocket_serve(
    [
        {
            b_https: true,
            n_port: 4343,
            s_hostname: 'localhost',
            s_path_certificate_file: './custom.crt',
            s_path_key_file: './custom.key',
            f_v_before_return_response: async function(o_request){
                // important if the connection is secure (https), 
                // the socket has to be opened with the wss:// protocol
                // from the client
                // for client: const socket = new WebSocket(`${window.location.protocol.replace('http', 'ws')}//${window.location.host}`);
                if(o_request.headers.get('Upgrade') == 'websocket'){

                    const { 
                        socket: o_socket,
                        response: o_response
                    } = Deno.upgradeWebSocket(o_request);

                    o_socket.addEventListener("open", () => {
                        console.log("a client connected!");
                        o_socket.send('hello from websocket');
                    });
                    
                    o_socket.addEventListener("message", async (event) => {
                        console.log(`a message was received ${event}`)
                    });
                    
                    return o_response;
                }

                return f_v_before_return_response__fileserver(
                    o_request,
                    `${s_path_folder_current}/`
                )
            }
        },
    ]
)