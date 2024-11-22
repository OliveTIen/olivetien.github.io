"use strict";
/* 
CSS渲染：
https://www.zhihu.com/question/40149352 
*/
// initialize
for (let wrapper of document.getElementsByClassName('waterdrop-wrapper')) {
    wrapper.style.width = window.innerWidth;
    wrapper.style.height = window.innerHeight;
}

for(let water of document.getElementsByClassName('waterdrop')){
    water.appendShine = function (width, height, top, left) {
        let shine = document.createElement('div');
        shine.classList.add('waterdrop-shine');/* 相对于水滴的位置 */
        shine.style.width = `${width}%`;
        shine.style.height = `${height}%`;
        shine.style.top = `${top}%`;
        shine.style.left = `${left}%`;
        water.appendChild(shine);
    }

    water.playShakeAnimation = function (){
        if (water.playingAnimation) return;

        water.playingAnimation = true;
        water.classList.add('ani-shake-drop');
        for (let child of water.children) {
            child.classList.add('ani-shake-shine');
        }

        setTimeout(() => {
            water.playingAnimation = false;
            water.classList.remove('ani-shake-drop');
            for (let child of water.children) {
                child.classList.remove('ani-shake-shine');
            }
        }, 500); // 500ms后调用
    }

    water.playAnimation = function(){
        // console.log(`is_colliding:${water.is_colliding}; dy:${water.last_y - water.y}; `);
        if (water.is_colliding_with_wall) {
            if (Math.abs(water.last_y - water.y) >= 1.0) water.playShakeAnimation();
        }
        if (water.is_colliding_with_water) {
            // 水滴非静止，则播放动画
            if (Math.abs(water.last_y - water.y) + Math.abs(water.last_x - water.x) >= 1.0) water.playShakeAnimation();
        }
    }

    water.updateData = function(){
        // update backup data
        water.last_x = water.x;
        water.last_y = water.y;
        // update data for rendering
        water.style.top = `${water.y - water.dataset.radius}px`;
        water.style.left = `${water.x - water.dataset.radius}px`;
        // water.innerHTML = `x: ${water.x.toFixed(3)}<br>y: ${water.y.toFixed(3) }`;
        // reset data for next frame
        water.is_colliding_with_wall = false;
        water.is_colliding_with_water = false;
    }



    water.gravityMove = function(dt, gravity_x, gravity_y){
        water.speed_x += gravity_x;
        water.speed_y += gravity_y;
        water.speed_x *= air_drag;
        water.speed_y *= air_drag;
        water.x += dt * water.speed_x;
        water.y += dt * water.speed_y;
    }

    water.handle_colliding_with_wall = function(rect){
        let r = parseFloat(water.dataset.radius);
        
        // console.log(`bounding_rect.left: ${rect.left}`)
        // console.log(`r:${r}`);
        // console.log(`r:${r.toFixed(3)}`);
        // let rect = water.parentNode.getBoundingClientRect();
        let p_bottom = rect.bottom;
        
        if (water.y > rect.bottom - r) {
            water.is_colliding_with_wall = true;
            water.y = rect.bottom - r;
            water.speed_y *= - 0.5;
        }
        
        if (water.y < rect.top + r) {
            water.is_colliding_with_wall = true;
            water.y = rect.top + r;
            water.speed_y *= - 0.5;
        }

        if (water.x > rect.right - r) {
            water.is_colliding_with_wall = true;
            water.x = rect.right - r;
            // if (water.speed_x > 0) water.speed_x *= - 0.5;
            water.speed_x *= - 0.5;
        }
        
        if (water.x < rect.left  + r) {
            water.is_colliding_with_wall = true;
            water.x = rect.left  + r;
            // if (water.speed_x < 0) water.speed_x *= - 0.5;
            water.speed_x *= - 0.5;
        }

        // water.style.top = `${water.y - r}px`;
        // water.style.left = `${water.x + r}px`;
    }

    let r = parseFloat(water.dataset.radius);// water.dataset.radius 引用 div 中的自定义属性 data-radius
    water.playingAnimation = false;
    water.is_colliding_with_wall = false;
    water.is_colliding_with_water = false;
    water.selected = false;
    water.x= parseFloat(water.style.left + r);
    water.y= parseFloat(water.style.top + r);
    water.last_x=water.x;
    water.last_y=water.y;
    water.speed_x= (Math.random() - 0.5) * 80;
    water.speed_y= (Math.random() - 0.5) * 10;
    water.mass = r*r;
    water.style.width=`${r * 2}px`;
    water.style.height= `${r * 2}px`;

    water.appendShine(12, 6, 85, 47);

}

// functions
function handleCollisionsBetweenWaters() {
let waters = document.getElementsByClassName('waterdrop');
for (let i = 0; i < waters.length; i++) {
    for (let j = i + 1; j < waters.length; j++) {
        let w1 = waters[i];
        let w2 = waters[j];

        let x1 = w1.x;
        let x2 = w2.x;
        let y1 = w1.y;
        let y2 = w2.y;
        let dx = x2-x1;
        let dy = y2-y1;
        let d = Math.sqrt(dx * dx + dy * dy);
        
        let r_sum = parseFloat(w1.dataset.radius) + parseFloat(w2.dataset.radius);
        
        // console.log(`x1y1x2y2: ${x1.toFixed(3) },${y1.toFixed(3) },${x2.toFixed(3) },${y2.toFixed(3) }; d: ${d.toFixed(3) }; r_sum: ${r_sum}`)
        // console.log(`d: ${d}; r_sum: ${r_sum}`)
        if (d < r_sum) {
            w1.is_colliding_with_water = true;
            w2.is_colliding_with_water = true;

            let sf = r_sum/d;// scale factor

            let xc = 0.5*(x1+x2);
            let yc = 0.5*(y1+y2);
            x1 = xc - dx/2.0*sf;
            y1 = yc - dy/2.0*sf;
            x2 = xc + dx/2.0*sf;
            y2 = yc + dy/2.0*sf;
            w1.x = x1;
            w2.x = x2;
            w1.y = y1;
            w2.y = y2;
                                
            let e = 1.0;// 恢复系数
            let nx = dx / d;
            let ny = dy / d;

            // 计算法向速度分量
            let dot1 = w1.speed_x * nx + w1.speed_y * ny;
            let dot2 = w2.speed_x * nx + w2.speed_y * ny;

            // 考虑质量进行法向速度交换
            let combinedMass = w1.mass + w2.mass;
            let coefficient1 = (2 * w2.mass) / combinedMass;
            let coefficient2 = (2 * w1.mass) / combinedMass;

            // 使用恢复系数调整法向速度
            let impulse1 = e * (dot2 - dot1);
            let impulse2 = e * (dot1 - dot2);

            // 更新法向速度分量
            w1.speed_x += impulse1 * nx * coefficient1;
            w1.speed_y += impulse1 * ny * coefficient1;
            w2.speed_x += impulse2 * nx * coefficient2;
            w2.speed_y += impulse2 * ny * coefficient2;

        }
    }
}
}


//// set events
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function set_pc_events() {
    // 鼠标按下事件
    document.addEventListener('mousedown', function (event) {
        const waters = document.getElementsByClassName('waterdrop');
        for (let water of waters) {
            const rect = water.getBoundingClientRect();
            if (event.clientX >= rect.left && event.clientX <= rect.right &&
                event.clientY >= rect.top && event.clientY <= rect.bottom) {
                // console.log('waterdrop selected');
                selectedWaterDrop = water;
                selectedWaterDrop.selected = true;
                lastMouseX = event.clientX;
                lastMouseY = event.clientY;
                break;
            }
        }
    });

    function update_waterdrop_by_mouse(event, selectedWaterDrop) {
        let sw = selectedWaterDrop;
        let r = parseFloat(sw.dataset.radius);

        // 更新水滴的位置 鼠标和触摸事件
        let x = event.clientX || event.touches[0].clientX;
        let y = event.clientY || event.touches[0].clientY;
        sw.x = x;
        sw.y = y;
        sw.style.left = `${sw.x - r}px`;
        sw.style.top = `${sw.y - r}px`;

        // 只在鼠标释放时更新水滴的速度
        if (event.type === 'mouseup') {
            // 计算鼠标速度
            const dx = lastMouseX - prevMouseX;
            const dy = lastMouseY - prevMouseY;
            sw.speed_x = dx / dt; // 鼠标速度需要转换为单位时间内的速度
            sw.speed_y = dy / dt;
            // console.log(`dx: ${dx}`)
            // console.log(`dy: ${dy}`)
            // console.log(`dt: ${dt}`)
            // console.log(`sw.speed_x: ${sw.speed_x}`)
            // console.log(`sw.speed_y: ${sw.speed_y}`)
        }

        // 更新最后鼠标坐标
        prevMouseX = lastMouseX;
        prevMouseY = lastMouseY;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }


    // 鼠标移动事件
    document.addEventListener('mousemove', function (event) {
        if (selectedWaterDrop) {
            update_waterdrop_by_mouse(event, selectedWaterDrop);
        }
    });

    // 鼠标放开事件
    document.addEventListener('mouseup', function (event) {
        if (selectedWaterDrop) {
            // console.log('waterdrop mouseup');
            update_waterdrop_by_mouse(event, selectedWaterDrop);
            selectedWaterDrop.selected = false;
            selectedWaterDrop = null;
        }
    });

    // 鼠标进入退出事件
    // 如果没反应，请检查waterdrop及其父元素的pointer-events属性是否设置为auto;
    for (let water of document.getElementsByClassName('waterdrop')) {
        water.addEventListener('mouseenter', () => {
            // console.log('waterdrop mouseenter');
            water.playShakeAnimation();
        });
        water.addEventListener('mouseleave', () => {
            // console.log('waterdrop mouseleave');
            water.playShakeAnimation();
        });
    }
}

function set_phone_events() {

    // 触摸开始事件
    document.addEventListener('touchstart', function (event) {
        const waters = document.getElementsByClassName('waterdrop');
        for (let water of waters) {
            const rect = water.getBoundingClientRect();
            if (event.touches[0].clientX >= rect.left && event.touches[0].clientX <= rect.right &&
                event.touches[0].clientY >= rect.top && event.touches[0].clientY <= rect.bottom) {
                selectedWaterDrop = water;
                // selectedWaterDrop.selected = true;
                lastMouseX = event.touches[0].clientX;
                lastMouseY = event.touches[0].clientY;
                break;
            }
        }
    });

    // 触摸移动事件
    document.addEventListener('touchmove', function (event) {
        if (selectedWaterDrop) {
            update_waterdrop_by_mouse(event, selectedWaterDrop);
        }
    });

    // 触摸结束事件
    document.addEventListener('touchend', function (event) {
        if (selectedWaterDrop) {
            // 更新最后一次触摸位置
            update_waterdrop_by_mouse(event, selectedWaterDrop);

            // 计算触摸速度
            const dx = lastMouseX - prevMouseX;
            const dy = lastMouseY - prevMouseY;

            // 设置水滴的速度
            selectedWaterDrop.speed_x = dx / dt;
            selectedWaterDrop.speed_y = dy / dt;

            // selectedWaterDrop.selected = false;
            selectedWaterDrop = null;
        }
    });

    function handleOrientation(event) {
        const gamma = event.gamma; // 横滚角度
        const beta = event.beta;   // 俯仰角度
        // 根据横滚和俯仰角度调整重力
        gravity_magnitude = 9.8;
        gravity_x = gravity_magnitude * Math.sin(gamma * Math.PI / 180);
        gravity_y = - gravity_magnitude * Math.sin(beta * Math.PI / 180);
    }
    window.addEventListener("deviceorientation", handleOrientation, true);
}



//// main
let dt = 0.001 * 30;// s
let gravity_x = 0.0;
let gravity_y = 9.8;
let air_drag = 0.995;
let w0 = document.getElementsByClassName('waterdrop')[0];
w0.speed_x = 20;

const bounding_rect = document.getElementsByClassName('waterdrop-wrapper')[0].getBoundingClientRect();
bounding_rect.resize = function () {
    bounding_rect.width = window.innerWidth;
    bounding_rect.height = window.innerHeight;
}
bounding_rect.resize();
// animation
setInterval(function () {
    for (let water of document.getElementsByClassName('waterdrop')){
        if (!water.selected) {
            water.gravityMove(dt, gravity_x, gravity_y);
        }
    }
    for (let water of document.getElementsByClassName('waterdrop')){
        water.handle_colliding_with_wall(bounding_rect);
    }
    handleCollisionsBetweenWaters();
    for (let water of document.getElementsByClassName('waterdrop')){
        water.playAnimation();
        water.updateData();
    }
}, dt * 1000);// ms


let selectedWaterDrop = null;
let lastMouseX = null;
let lastMouseY = null;
let prevMouseX = null;
let prevMouseY = null;

window.addEventListener('resize', function () {
    bounding_rect.resize();
});

if (isMobileDevice()) {
    set_phone_events();
} else {
    set_pc_events();
}

