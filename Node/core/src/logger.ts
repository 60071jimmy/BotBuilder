// 
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
// 
// Microsoft Bot Framework: http://botframework.com
// 
// Bot Builder SDK Github:
// https://github.com/Microsoft/BotBuilder
// 
// Copyright (c) Microsoft Corporation
// All rights reserved.
// 
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
// 
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

import sprintf = require('sprintf-js');
import Channel = require('./Channel');
import ses = require('./Session');
import consts = require('./consts');
import prompts = require('./dialogs/Prompts');

export function error(fmt: string, ...args: any[]): void {
    var msg = args.length > 0 ? sprintf.vsprintf(fmt, args) : fmt;
    console.error('ERROR: ' + msg);
}

export function warn(addressable: ses.Session|IMessage|IAddress, fmt: string, ...args: any[]): void {
    var prefix = getPrefix(<ses.Session>addressable);
    var msg = args.length > 0 ? sprintf.vsprintf(fmt, args) : fmt;
    console.warn(prefix + 'WARN: ' + msg);
}

export function info(addressable: ses.Session|IMessage|IAddress, fmt: string, ...args: any[]): void {
    var channelId = Channel.getChannelId(addressable);
    switch (channelId) {
        case Channel.channels.emulator:
            var prefix = getPrefix(<ses.Session>addressable);
            var msg = args.length > 0 ? sprintf.vsprintf(fmt, args) : fmt;
            console.info(prefix + msg);
            break;
    }    
}

function getPrefix(addressable: ses.Session): string {
    var prefix = '';
    if (addressable && addressable.sessionState && addressable.sessionState.callstack) {
        var callstack = addressable.sessionState.callstack;
        for (var i = 0; i < callstack.length; i++) {
            if (i == callstack.length - 1) {
                var cur = callstack[i];
                switch (cur.id) {
                    case consts.DialogId.Prompts:
                        var promptType = prompts.PromptType[(<prompts.IPromptArgs>cur.state).promptType];
                        prefix += 'Prompts.' + promptType + ' - ';
                        break;
                    case consts.DialogId.FirstRun:
                        prefix += 'Middleware.firstRun - '; 
                        break;
                    default:
                        prefix += cur.id + ' - ';
                        break;
                }
            } else {
                prefix += '.';
            }
        }
    }
    return prefix;
}