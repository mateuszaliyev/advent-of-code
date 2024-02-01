x = open("input.txt", "r").read()
grid, ins = x.split("\n\n")

### Parsing ###
grid = grid.split("\n")
width = max([len(line) for line in grid])
height = len(grid)
grid = [" " + line.ljust(width) + " " for line in grid]
width += 2
height += 2
grid = [" "*width] + grid + [" "*width]

ins_list = []
buffer = ""
for c in ins.strip("\n"):
    if c in "LR":
        if buffer != "":
            ins_list += [int(buffer)]
            buffer = ""
        ins_list += [c]
    else:
        buffer += c

if buffer != "":
    ins_list += [int(buffer)]
    buffer = ""

### Starting Position ###
x=y=1 #NOTE: pos is 1 index to accomidate buffer for bounds checking
dir = 0
dir_lookup = [[0,1],[1,0],[0,-1],[-1,0]]
for j in range(width):
    if grid[1][j] == ".":
        y=j
        break
dir_cache = (x,y)

### Part 1 ###
for step in ins_list:
    #print(x,y,dir,step)
    if step == "R":
        dir = (dir+1)%4
    elif step == "L":
        dir = (dir-1)%4
    else:
        dx,dy = dir_lookup[dir]
        for i in range(step):
            nx,ny = x+dx,y+dy
            if grid[nx][ny] == " ":
                while True:
                    nx,ny = nx-dx,ny-dy
                    if grid[nx][ny] == " ":
                        break
                nx,ny = nx+dx,ny+dy
            if grid[nx][ny] == "#":
                break
            x,y = nx,ny

print(x*1000+y*4+dir)

### Face size (work with both input and test data, and other sizes in general) ###
face_size = round(pow(sum([c != " " for line in grid for c in line])//6,0.5))

### Generate initial net adajencies ###
Q = [dir_cache]
visited = {dir_cache:[None]*4}
while len(Q) > 0:
    #print(Q)
    v, *Q = Q
    x,y=v
    for dir in range(4):
        i,j = dir_lookup[dir]
        i,j = x+i*face_size,y+j*face_size
        if not(0 <= i < height and 0 <= j < width):
            continue
        if grid[i][j] == " ":
            continue
        w = (i,j)
        if w not in visited:
            visited[v][dir] = w
            w_list = [None]*4
            w_list[(dir+2)%4] = v
            visited[w] = w_list
            Q += [w]

### Normaize face-edge mapping ###
faces = {}
for i,j in visited:
    faces[(i//face_size,j//face_size)] = [((v[0]//face_size,v[1]//face_size) if v is not None else v) for v in visited[(i,j)]]

### Fill in missing edge data using corners ###
while sum([edge is None for key in faces for edge in faces[key]]) > 0:
    for face in faces:
        for dir in range(4):
            if faces[face][dir] is None:
                for delta in -1,1:
                    common_face = faces[face][(dir+delta)%4]
                    if common_face is None:
                        continue
                    common_face_edge = faces[common_face].index(face)
                    missing_face = faces[common_face][(common_face_edge+delta)%4]
                    if missing_face is None:
                        continue
                    missing_face_edge = faces[missing_face].index(common_face)
                    faces[missing_face][(missing_face_edge+delta)%4] = face
                    faces[face][dir] = missing_face
                    break

# DEBUG
#for key in faces: print(key, faces[key])

### Part 2 ###
x,y = dir_cache
dir = 0
edge_top_offset_out = [[1,1],[1,face_size],[face_size,face_size],[face_size,1]]
for step in ins_list:
    #print("step",x,y,dir,step)
    if step == "R":
        dir = (dir+1)%4
    elif step == "L":
        dir = (dir-1)%4
    else:
        dx,dy = dir_lookup[dir]
        new_dir = dir
        for i in range(step):
            nx,ny = x+dx,y+dy
            if grid[nx][ny] == " ":
                #compute current edge prop
                cur_face = (x-1)//face_size,(y-1)//face_size
                cur_offset = 0
                while tuple([a*face_size+b+c*cur_offset for a,b,c in zip(cur_face,edge_top_offset_out[(dir+1)%4],dir_lookup[(dir+1)%4])]) != (x,y):
                    cur_offset += 1
                #Compute next edge prop
                next_face = faces[cur_face][dir]
                new_dir = (faces[next_face].index(cur_face) + 2) % 4
                nx,ny = tuple([a*face_size+b+c*cur_offset for a,b,c in zip(next_face,edge_top_offset_out[new_dir],dir_lookup[(new_dir+1)%4])])
            if grid[nx][ny] == "#":
                break
            else:
                x,y = nx,ny
                dir = new_dir
                dx,dy = dir_lookup[dir]

print(x*1000+y*4+dir)