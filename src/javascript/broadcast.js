export var broadcast = function(config, htmlElement, onRoomFound) {
    var self = {
        userToken: uniqueToken()
        },
        channels = '--',
        isbroadcaster,
        isGetNewRoom = true,
        participants = 1,
        defaultSocket = { };
        console.log(self.userToken)
    function openDefaultSocket(callback) {
        defaultSocket = config.openSocket({
            onmessage: onDefaultSocketResponse,
            callback: function(socket) {
                console.log('socket', socket)
                defaultSocket = socket;
                callback();
            }
        });
    }

    function onDefaultSocketResponse(response) {
        console.log('ondefaultsocketresponse', response)
        if (response.userToken === self.userToken) return;

        if (isGetNewRoom && response.roomToken && response.broadcaster) onRoomFound(response);

        if (response.userToken && response.joinUser === self.userToken && response.participant && channels.indexOf(response.userToken) === -1) {
            channels += response.userToken + '--';
            openSubSocket({
                isofferer: true,
                channel: response.channel || response.userToken,
                closeSocket: true
            });
        }
    }

    function openSubSocket(_config) {
        console.log('_config.channel', _config.channel)
        if (!_config.channel) return;
        var socketConfig = {
            channel: _config.channel,
            onmessage: socketResponse,
            onopen: function() {
                if (isofferer && !peer) initPeer();
            }
        };

        socketConfig.callback = function(_socket) {
            socket = _socket;
            this.onopen();

            if(_config.callback) {
                _config.callback();
            }
        };

        var socket = config.openSocket(socketConfig),
            isofferer = _config.isofferer,
            gotstream,
            // htmlElement,
            inner = { },
            peer;

        var peerConfig = {
            constraints: {
                mandatory: {
                    OfferToReceiveAudio: true,
                    OfferToReceiveVideo: true
                },
                optional: []
            },
            attachStream: config.attachStream,
            onICE: function(candidate) {
                socket.send({
                    userToken: self.userToken,
                    candidate: {
                        sdpMLineIndex: candidate.sdpMLineIndex,
                        candidate: JSON.stringify(candidate.candidate)
                    }
                });
            },
            onRemoteStream: function(stream) {
                console.log('onRemoteStream', stream)
                if (!stream) return;

                // try {
                //     htmlElement.setAttributeNode(document.createAttribute('autoplay'));
                //     htmlElement.setAttributeNode(document.createAttribute('playsinline'));
                //     htmlElement.setAttributeNode(document.createAttribute('controls'));
                // } catch (e) {
                //     htmlElement.setAttribute('autoplay', true);
                //     htmlElement.setAttribute('playsinline', true);
                //     htmlElement.setAttribute('controls', true);
                // }

                console.log('htmlElement', htmlElement)

                htmlElement.srcObject = stream;
                console.log('htmlElement', htmlElement.srcObject)
                _config.stream = stream;
                if (self.isAudio) {
                    
                afterRemoteStreamStartedFlowing();
                    
                } else onRemoteStreamStartsFlowing();
            }
        };

        function initPeer(offerSDP) {
            if (!offerSDP) {
                peerConfig.onOfferSDP = sendsdp;
            } else {
                peerConfig.offerSDP = offerSDP;
                peerConfig.onAnswerSDP = sendsdp;
            }

            peer = RTCPeerConnection(peerConfig);
        }

        function onRemoteStreamStartsFlowing() {
            if(navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i)) {
                // if mobile device
                return afterRemoteStreamStartedFlowing();
            }
            afterRemoteStreamStartedFlowing();
        }

        function afterRemoteStreamStartedFlowing() {
            gotstream = true;
            // config.onRemoteStream(htmlElement);

            /* closing subsocket here on the offerer side */
            if (_config.closeSocket) socket = null;
        }

        function sendsdp(sdp) {
            sdp = JSON.stringify(sdp);
            var part = parseInt(sdp.length / 3);

            var firstPart = sdp.slice(0, part),
                secondPart = sdp.slice(part, sdp.length - 1),
                thirdPart = '';

            if (sdp.length > part + part) {
                secondPart = sdp.slice(part, part + part);
                thirdPart = sdp.slice(part + part, sdp.length);
            }

            socket.send({
                userToken: self.userToken,
                firstPart: firstPart
            });

            socket.send({
                userToken: self.userToken,
                secondPart: secondPart
            });

            socket.send({
                userToken: self.userToken,
                thirdPart: thirdPart
            });
        }

        function socketResponse(response) {
            if (response.userToken === self.userToken) return;
            if (response.firstPart || response.secondPart || response.thirdPart) {
                if (response.firstPart) {
                    inner.firstPart = response.firstPart;
                    if (inner.secondPart && inner.thirdPart) selfInvoker();
                }
                if (response.secondPart) {
                    inner.secondPart = response.secondPart;
                    if (inner.firstPart && inner.thirdPart) selfInvoker();
                }

                if (response.thirdPart) {
                    inner.thirdPart = response.thirdPart;
                    if (inner.firstPart && inner.secondPart) selfInvoker();
                }
            }

            if (response.candidate && !gotstream) {
                peer && peer.addICE({
                    sdpMLineIndex: response.candidate.sdpMLineIndex,
                    candidate: JSON.parse(response.candidate.candidate)
                });
            }
        }

        var invokedOnce = false;

        function selfInvoker() {
            if (invokedOnce) return;

            invokedOnce = true;

            inner.sdp = JSON.parse(inner.firstPart + inner.secondPart + inner.thirdPart);
            if (isofferer) {
                peer.addAnswerSDP(inner.sdp);
                if (config.onNewParticipant) config.onNewParticipant(participants++);
            } else initPeer(inner.sdp);
        }
    }

    function startBroadcasting() {
        defaultSocket && defaultSocket.send({
            roomToken: self.roomToken,
            roomName: self.roomName,
            broadcaster: self.userToken,
            isAudio: self.isAudio
        });
        setTimeout(startBroadcasting, 3000);
    }

    function uniqueToken() {
        var s4 = function() {
            return Math.floor(Math.random() * 0x10000).toString(16);
        };
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    }

    openDefaultSocket(config.onReady || function() {});
    // config.onReady || 
    return {
        createRoom: function(_config) {
            self.roomName = _config.roomName || 'Anonymous';
            self.isAudio = _config.isAudio;
            self.roomToken = uniqueToken();

            isbroadcaster = true;
            isGetNewRoom = false;
            startBroadcasting();
            console.log('config', _config)
        },
        joinRoom: function(_config) {
            self.roomToken = _config.roomToken;
            self.isAudio = _config.isAudio;
            isGetNewRoom = false;

            openSubSocket({
                channel: self.userToken,
                callback: function() {
                    defaultSocket.send({
                        participant: true,
                        userToken: self.userToken,
                        joinUser: _config.joinUser
                    });
                }
            });
        }
    };
};