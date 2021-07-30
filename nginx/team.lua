local jwt = require "resty.jwt"
local cjson = require "cjson"
cjson.encode_empty_table_as_object(false)

-- first try to find JWT token as url parameter e.g. ?token=BLAH
local token = ngx.var.arg_token

-- next try to find JWT token as Cookie e.g. token=BLAH
if token == nil then
    token = ngx.var.cookie_token
end

-- try to find JWT token in Authorization header Bearer string
if token == nil then
    local auth_header = ngx.var.http_Authorization
    if auth_header then
        _, _, token = string.find(auth_header, "Bearer%s+(.+)")
    end
end

-- finally, if still no JWT token, kick out an error and exit
if token == nil then
    ngx.status = ngx.HTTP_UNAUTHORIZED
    ngx.header.content_type = "application/json; charset=utf-8"
    ngx.say("{\"error\": \"missing JWT token or Authorization header\"}")
    ngx.exit(ngx.HTTP_UNAUTHORIZED)
end

local payload = {
    name = ngx.var.team
}

-- Build json response at Nginx using Lua
ngx.header.content_type = "application/json; charset=utf-8"
ngx.say(cjson.encode(payload))
return ngx.exit(ngx.HTTP_OK)
