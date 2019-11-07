# Rust Rcon Discord Bot

Features
=======

  * Chat log sent to Discord.
  * In Game reports sent to Discord.
  * Ability to run Rcon commands in Discord.
  * Bots status lists current player count. `200/200(50 queued)`
  * Basic permissions system.
  
Configuration
=============

Configs are loaded from a file called `config.json` located in the project root directory. The following configs are available.

* token - The Discord bot token to use.
* host - The Rust servers ip address.
* port - The Rust servers port.
* password - The password used to authenticate with RCON.
* serverInfoInterval - The interval to scrap RCON for server information.
* tryConnectionInterval - The internval to retry connection to the rust server
* defaultActivity - The Activity message to appear when server population is below 20 players.
* rconChannel - The channel ID to listen for RCON commands and send chat logs to.
* modRole - The Discord role ID associated with Mods.
* adminRle - The Discord role ID associated with Admins.
* reportChannel - The channel ID to send in game reports to.
