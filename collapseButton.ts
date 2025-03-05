import { _decorator, Component, Node, Button, UITransform, Vec3, EventTouch, Material, MeshRenderer, Sprite, v3, Vec2, Vec4 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('collapseButton')
export class collapseButton extends Component {
    @property(Node)
    bgNode:Node = null;

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

    update(dt: number) {

    }

    private onTouchStart(event: EventTouch) {
        let localPos = event.getLocation();
        console.log("屏幕坐标");
        console.table(localPos);

        let uiPos = event.getUILocation();
        console.log("ui坐标");
        console.table(uiPos);

        let nodePos2 = this.bgNode.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(uiPos.x, uiPos.y, 0));

        // let nodePos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(localPos.x, localPos.y, 0));
        // console.log("屏幕坐标 2 node")
        // console.table(nodePos);

        // let nodePos2 = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(uiPos.x, uiPos.y, 0));
        // console.log("ui坐标 2 node")
        // console.table(nodePos2);

        // // let btnNodePos = this.btnNode.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(uiPos.x, uiPos.y, 0))
        // let btnNodePos = this.btnNode.getComponent(UITransform).convertToNodeSpaceAR(nodePos2)
        // console.log("ui坐标 2 btnNode")
        // console.table(btnNodePos);

        // this.node.setWorldPosition(new Vec3(uiPos.x, uiPos.y, 0));

        //pos2uv 如果需要朝点击处塌陷touchPos传该坐标
        let width = this.bgNode.getComponent(UITransform).width;
        let height = this.bgNode.getComponent(UITransform).height;
        let uv = new Vec2();
        nodePos2.add3f(width / 2, height / 2, 0);
        uv.x = nodePos2.x / width;
        uv.y = (height - nodePos2.y) / height;
        console.log("uv", uv);

        //矩形的中心点
        let btnMidUv = new Vec2();
        let btnNodeMid = this.node.getWorldPosition();
        let btnNodeMid2Node = this.bgNode.getComponent(UITransform).convertToNodeSpaceAR(btnNodeMid);
        btnNodeMid2Node.add3f(width / 2, height / 2, 0);
        btnMidUv.x = btnNodeMid2Node.x / width;
        btnMidUv.y = (height - btnNodeMid2Node.y) / height;
        // let uvWidth = btnWidth / width;
        // let uvHight = btnHigth / height;

        //btn Uv
        let btnWidth = this.node.getComponent(UITransform).width;
        let btnHigth = this.node.getComponent(UITransform).height;
        let btnOriginUv = new Vec2();
        let btnNodeLu = this.node.getWorldPosition().add3f(-btnWidth / 2, btnHigth / 2, 0);
        let btnNodeLu2Node =  this.bgNode.getComponent(UITransform).convertToNodeSpaceAR(btnNodeLu);
        btnNodeLu2Node.add3f(width / 2, height / 2, 0);
        btnOriginUv.x = btnNodeLu2Node.x / width;
        btnOriginUv.y = (height - btnNodeLu2Node.y) / height;
        let uvWidth = btnWidth / width;
        let uvHight = btnHigth / height;

        if(this.node.getComponent(UITransform).getBoundingBoxToWorld().contains(new Vec2(uiPos.x, uiPos.y))){
            this.bgNode.getComponent(Sprite).materials[0].setProperty("rect", new Vec4(btnOriginUv.x, btnOriginUv.y, uvWidth, uvHight));
            this.bgNode.getComponent(Sprite).materials[0].setProperty("touchPos", btnMidUv);
        }

        if (!this._isPressed) {
            this._isPressed = true;
        }
    }

    private onTouchEnd(event: EventTouch) {
        this.bgNode.getComponent(Sprite).materials[0].setProperty("touchPos", new Vec2(-0.5, -0.5));
// 
        if (this._isPressed) {
            this._isPressed = false;
        }
    }

    private onTouchCancel(event:EventTouch){
        this.bgNode.getComponent(Sprite).materials[0].setProperty("touchPos", new Vec2(-0.5, -0.5));
    }

    private onTouchMove(event: EventTouch){
        let uiPos = event.getUILocation();
        let nodePos2 = this.bgNode.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(uiPos.x, uiPos.y, 0));

        // let btnNodePos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(uiPos.x, uiPos.y, 0))
        // console.log("ui坐标 2 btnNode")
        // console.table(btnNodePos);

        let width = this.bgNode.getComponent(UITransform).width;
        let height = this.bgNode.getComponent(UITransform).height;

        let uv = new Vec2();
        nodePos2.add3f(width / 2, height / 2, 0);
        uv.x = nodePos2.x / width;
        uv.y = (height - nodePos2.y) / height;
        // console.log("uv", uv);

        //矩形的中心点
        let btnMidUv = new Vec2();
        let btnNodeMid = this.node.getWorldPosition();
        let btnNodeMid2Node = this.bgNode.getComponent(UITransform).convertToNodeSpaceAR(btnNodeMid);
        btnNodeMid2Node.add3f(width / 2, height / 2, 0);
        btnMidUv.x = btnNodeMid2Node.x / width;
        btnMidUv.y = (height - btnNodeMid2Node.y) / height;

        //btn Uvn
        let btnWidth = this.node.getComponent(UITransform).width;
        let btnHigth = this.node.getComponent(UITransform).height;
        let btnOriginUv = new Vec2();
        let btnNodeLu = this.node.getWorldPosition().add3f(-btnWidth / 2, btnHigth / 2, 0);
        let btnNodeLu2Node =  this.bgNode.getComponent(UITransform).convertToNodeSpaceAR(btnNodeLu);
        btnNodeLu2Node.add3f(width / 2, height / 2, 0);
        btnOriginUv.x = btnNodeLu2Node.x / width;
        btnOriginUv.y = (height - btnNodeLu2Node.y) / height;
        let uvWidth = btnWidth / width;
        let uvHight = btnHigth / height;

        // 支持滑动按钮
        if(this.node.getComponent(UITransform).getBoundingBoxToWorld().contains(new Vec2(uiPos.x, uiPos.y))){
            this.bgNode.getComponent(Sprite).materials[0].setProperty("rect", new Vec4(btnOriginUv.x, btnOriginUv.y, uvWidth, uvHight));
            this.bgNode.getComponent(Sprite).materials[0].setProperty("touchPos", uv);
        }
    }
}