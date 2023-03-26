# minecraft-server-util

[![npm version](https://img.shields.io/npm/v/minecraft-server-util?label=version)](https://www.npmjs.com/package/minecraft-server-util)
![Version](https://img.shields.io/github/languages/top/PassTheMayo/minecraft-server-util)
[![License](https://img.shields.io/npm/l/minecraft-server-util)](https://github.com/PassTheMayo/minecraft-server-util/blob/master/LICENSE)
![npm weekly downloads](https://img.shields.io/npm/dw/minecraft-server-util)
[![GitHub open issues](https://img.shields.io/github/issues-raw/PassTheMayo/minecraft-server-util)](https://github.com/PassTheMayo/minecraft-server-util/issues)

A Node.js library for Minecraft servers that can retrieve status, perform queries, and RCON into servers. It uses modern Minecraft protocols to support the latest servers and also includes backward compatibility for older versions. This library supports both Java Edition and Bedrock Edition servers, as long as the correct method is used.

Everything you need to know to get started is located within our documentation website: **https://passthemayo.gitbook.io/minecraft-server-util/**

---

&#9888; **Future Deprecation Warning** &#9888;

Please note that this library will be deprecated in the near future due to issues with unreliable networking in the Node.js standard library. It is recommended that you use my other service, [mcstatus.io](https://mcstatus.io) instead, as it has been extensively tested for all Minecraft versions, and does not rely on your network which may or may not support all Minecraft ping protocols. You may still use this library as it *should* work as well, but no support will be provided.