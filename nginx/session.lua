local jwt = require "resty.jwt"
local cjson = require "cjson"

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

-- Fetching data from JWT payload
local jwt_obj = jwt:load_jwt(token).payload
local name = jwt_obj.name
local email = jwt_obj.email
local groups = jwt_obj.groups
local teams = {}
local allTeams = {}
local teamSet = {}
local core = cjson.decode(os.getenv('CORE'))
local currentCluster = cjson.decode(os.getenv('CLUSTER'))
local teamList = cjson.decode(os.getenv('TEAMS'))
local clusters = { currentCluster }
setmetatable(clusters, cjson.array_mt)
local isAdmin = false
for _,v in ipairs(groups) do
  if v == 'admin' then
    isAdmin = true
  end
  if string.find(v, "team-([a-z-]+)") then
    if not teamSet[v] then
      local team = string.sub(v, 6)
      if team == 'admin' then
        isAdmin = true
      else
        table.insert(teams, team)
        table.insert(allTeams, { id = team })
        teamSet[v] = true
      end
    end
  end
end
if isAdmin then
  allTeams = {}
  for _,team in ipairs(teamList) do
    table.insert(allTeams, { id = team })
  end
end
local out = cjson.encode({ user = { isAdmin = isAdmin, name = name, email = email, groups = groups, teams = teams }, teams = allTeams, core = core, clusters = clusters })
-- Build json response at Nginx using Lua
ngx.header.content_type = "application/json; charset=utf-8"
ngx.say(out)
return ngx.exit(ngx.HTTP_OK)
