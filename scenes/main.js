addLevel(
  [
  '!^^^^^^^^^^^^    &',
  '!^^^^^^^^^^^^    &',
  '!^^^^^^^^^^^^    &', 
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  ],{
    width: 30,
    height: 22,
    '!':[sprite('left-wall'),'left-wall',scale(0.5)],
    '&':[sprite('right-wall'),'right-wall',scale(0.5)],
    '^':[sprite('space-invaders'),scale(0.7),'space-invaders'],
    
  }
)
const move_speed = 200

layer(["ui","obj"],"obj")
const player = add([
  sprite('space-ship'),
  pos(width()/2,height()/2),
  origin('center'),
] 
)
const score = add([
  text('0'),
  layer('ui'),
  pos(30,30),
  scale(1.5),
  {value:0},
])
const Time_left = 30
const timer=add([
  text('0'),
  pos(300,30),
  scale(1.5),
  layer('ui'),
  {time:Time_left,},
])

timer.action(()=>{
  timer.time -= dt()
  timer.text = timer.time.toFixed(2)
  if(timer.time <= 0){
    go('lose',score.value)
  }
})

const INVADER_SPEED = 100
let CURRENT_SPEED = INVADER_SPEED
const LEVEL_DOWN = 50
action('space-invaders',(s) =>{
   s.move(CURRENT_SPEED,0)
})

collides('space-invaders','right-wall',()=>{
  CURRENT_SPEED = -INVADER_SPEED
  every('space-invaders',(s)=>{
    s.move(0,LEVEL_DOWN)
  })
})

collides('space-invaders','left-wall',()=>{
  CURRENT_SPEED = INVADER_SPEED
  every('space-invaders',(s)=>{
    s.move(0,LEVEL_DOWN)
  })
})

keyDown('right',() =>{
  player.move(move_speed,0)
})
keyDown('left',() =>{
  player.move(-move_speed,0)
})
keyDown('up',() =>{
  player.move(0,-move_speed)
})
keyDown('down',() =>{
  player.move(0,move_speed)
})
/*keyDown('down',() =>{
  player.move(0,move_speed)
})
keyDown('up',() =>{
  player.move(0,-move_speed)
})*/

player.overlaps('space-invaders',()=>{
  go('lose',{score:score.value})
})

action('space-invaders',(s)=>{
  if(s.pos.y >= height()/2){
    go('lose',{score:score.value})
  }
})

function spawnBullet(p){
  add([
    rect(6,16),
    pos(p),
    origin('center'),
    color(0.5,0.5,1),
    'bullet'
  ])
}

keyPress('space',()=>{
  spawnBullet(player.pos.add(0,-25))
})
const BULLET_SPEED = 400
action('bullet',(b)=>{
  b.move(0,-BULLET_SPEED)
  if(b.pos.y < 0){
    destroy(b)
  }
})

collides('space-invaders','bullet',(s,b)=>{
  camShake(4)
  destroy(s)
  destroy(b)
  score.value++
  score.text = score.value
})
