import { _decorator, Component, Node, Button, UITransform, Vec3, EventTouch, Material, MeshRenderer, Sprite, v3, Vec2, Vec4 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MetaballButton')
export class MetaballButton extends Component {
    @property(Node)
    btnNodes:Node[] = [];

    private _isPressed: boolean = false;

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);

        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        
    }

    checkCollide(pos:Vec2){
        for(let i = 0; i < this.btnNodes.length; i ++){
            if(this.btnNodes[i].getComponent(UITransform).getBoundingBoxToWorld().contains(new Vec2(pos.x, pos.y))){
                return this.btnNodes[i];
            }
        }
        return null;
    }

    private onTouchStart(event: EventTouch) {
        let localPos = event.getLocation();
        console.log("屏幕坐标");
        console.table(localPos);

        let uiPos = event.getUILocation();
        console.log("ui坐标");
        console.table(uiPos);

        let nodePos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(localPos.x, localPos.y, 0));
        console.log("屏幕坐标 2 node")
        console.table(nodePos);

        let nodePos2 = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(uiPos.x, uiPos.y, 0));
        console.log("ui坐标 2 node")
        console.table(nodePos2);

        //pos2uv
        let width = this.node.getComponent(UITransform).width;
        let height = this.node.getComponent(UITransform).height;
        let uv = new Vec2();
        nodePos2.add3f(width / 2, height / 2, 0);
        uv.x = nodePos2.x / width;
        uv.y = (height - nodePos2.y) / height;
        console.log("uv", uv);


        let btnNode = this.checkCollide(uiPos);
        if(btnNode){
            //矩形的中心点
            let btnMidUv = new Vec2();
            let btnNodeMid = btnNode.getWorldPosition();
            let btnNodeMid2Node = this.node.getComponent(UITransform).convertToNodeSpaceAR(btnNodeMid);
            btnNodeMid2Node.add3f(width / 2, height / 2, 0);
            btnMidUv.x = btnNodeMid2Node.x / width;
            btnMidUv.y = (height - btnNodeMid2Node.y) / height;
            // let uvWidth = btnWidth / width;
            // let uvHight = btnHigth / height;

            //btn Uv
            let btnWidth = btnNode.getComponent(UITransform).width;
            let btnHigth = btnNode.getComponent(UITransform).height;
            let btnOriginUv = new Vec2();
            let btnNodeLu = btnNode.getWorldPosition().add3f(-btnWidth / 2, btnHigth / 2, 0);
            let btnNodeLu2Node =  this.node.getComponent(UITransform).convertToNodeSpaceAR(btnNodeLu);
            btnNodeLu2Node.add3f(width / 2, height / 2, 0);
            btnOriginUv.x = btnNodeLu2Node.x / width;
            btnOriginUv.y = (height - btnNodeLu2Node.y) / height;
            let uvWidth = btnWidth / width;
            let uvHight = btnHigth / height;

            this.node.getComponent(Sprite).materials[0].setProperty("rect", new Vec4(btnOriginUv.x, btnOriginUv.y, uvWidth, uvHight));
            this.node.getComponent(Sprite).materials[0].setProperty("touchPos", btnMidUv);
        }
        else{
            console.warn("没有触摸到按钮");
        }

        if (!this._isPressed) {
            this._isPressed = true;
        }
    }

    private onTouchEnd(event: EventTouch) {
        this.node.getComponent(Sprite).materials[0].setProperty("touchPos", new Vec2(-0.5, -0.5));
// 
        if (this._isPressed) {
            this._isPressed = false;
        }
    }

    private onTouchMove(event: EventTouch){
        // let uiPos = event.getUILocation();
        // let nodePos2 = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(uiPos.x, uiPos.y, 0));

        // let btnNodePos = this.btnNode.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(uiPos.x, uiPos.y, 0))
        // console.log("ui坐标 2 btnNode")
        // console.table(btnNodePos);

        // let width = this.node.getComponent(UITransform).width;
        // let height = this.node.getComponent(UITransform).height;
        // let uv = new Vec2();
        // nodePos2.add3f(width / 2, height / 2, 0);
        // uv.x = nodePos2.x / width;
        // uv.y = (height - nodePos2.y) / height;
        // console.log("uv", uv);

        // //矩形的中心点
        // let btnMidUv = new Vec2();
        // let btnNodeMid = this.btnNode.getWorldPosition();
        // let btnNodeMid2Node = this.node.getComponent(UITransform).convertToNodeSpaceAR(btnNodeMid);
        // btnNodeMid2Node.add3f(width / 2, height / 2, 0);
        // btnMidUv.x = btnNodeMid2Node.x / width;
        // btnMidUv.y = (height - btnNodeMid2Node.y) / height;

        // //btn Uv
        // let btnWidth = this.btnNode.getComponent(UITransform).width;
        // let btnHigth = this.btnNode.getComponent(UITransform).height;
        // let btnOriginUv = new Vec2();
        // let btnNodeLu = this.btnNode.getWorldPosition().add3f(-btnWidth / 2, btnHigth / 2, 0);
        // let btnNodeLu2Node =  this.node.getComponent(UITransform).convertToNodeSpaceAR(btnNodeLu);
        // btnNodeLu2Node.add3f(width / 2, height / 2, 0);
        // btnOriginUv.x = btnNodeLu2Node.x / width;
        // btnOriginUv.y = (height - btnNodeLu2Node.y) / height;
        // let uvWidth = btnWidth / width;uv
        // let uvHight = btnHigth / height;

        // this.node.getComponent(Sprite).materials[0].setProperty("touchPos", uv);
        // if(this.btnNode.getComponent(UITransform).getBoundingBoxToWorld().contains(new Vec2(uiPos.x, uiPos.y))){
        //     this.node.getComponent(Sprite).materials[0].setProperty("rect", new Vec4(btnOriginUv.x, btnOriginUv.y, uvWidth, uvHight));
        //     this.node.getComponent(Sprite).materials[0].setProperty("touchPos", uv);
        // }
    }
}