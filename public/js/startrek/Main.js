/**
 * Created by Administrator on 2016/7/20.
 */
var HCC_LIGHTS=HCC_LIGHTS||{};
HCC_LIGHTS.loadIni=function(){
    //���������ļ�
    HCC_LIGHTS.ViewIni={};
    $.getJSON("data/ViewIni.json",function(data_){
        HCC_LIGHTS.ViewIni=data_;
        HCC_LIGHTS.init();
    });

}
HCC_LIGHTS.init=function(){
    //DOM
    HCC_LIGHTS.ControlDiv=$("#controls_div")[0];

    //gui init
    HCC_LIGHTS.effectController={};
    HCC_LIGHTS.gui = new dat.GUI();

    //��ʼ��Three.js
    var three = new LHF_WEBGL.InitThree($("#webgl_canvas")[0], 1280, 720, 30, 10, 20000, true);
    three.main_camera.position.set(0, 10, 800);
    //three.main_camera.lookAt(new THREE.Vector3(0, 0, 0));
    three.main_camera.lookAt(new THREE.Vector3(0, 0, -2000));
    three.main_renderer.setClearColor(0x303231);
    HCC_LIGHTS.three=three;

    //axis
    var axis=new THREE.AxisHelper(10000);
    three.main_scene.add(axis);
    axis.visible=false;
    HCC_LIGHTS.effectController.axisEnabled=false;
    this.axisChange=function(){
        axis.visible=HCC_LIGHTS.effectController.axisEnabled;
    }
    HCC_LIGHTS.gui.add(HCC_LIGHTS.effectController, "axisEnabled").onChange(this.axisChange);

    //sky
    var sky_=new HCC_LIGHTS.Sky(three.main_scene);
    //var sky_=new HCC_LIGHTS.Sky(three.skyScene);
    HCC_LIGHTS.sky=sky_;

    //stars
    var star=new HCC_LIGHTS.StarScene(three.main_scene);
    HCC_LIGHTS.star=star;

    //stars stuts �ǿ�״̬����.. ����/���ߵ�..
    new HCC_LIGHTS.LineManager();

    /**     * ���ֿ���     */
    var visualizer=new HCC_IOT.AudioVisualizer(function(){
        console.log("music play");},function(){console.log("music end");});
    visualizer.init();
    var musicControls=new HCC_IOT.AudioControls(visualizer);
    star.startMusicAni(visualizer);

    //�ӽǿ���
    HCC_LIGHTS.camauto=new HCC_LIGHTS.CameraContols();

    /**     * ���ݽ���     */
    var dataMana=new HCC_LIGHTS.DataInterface(HCC_LIGHTS.lineMana);

    //��Ļ����Ӧ
    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        var tw_=HCC_LIGHTS.ControlDiv.clientWidth;
        var th_=HCC_LIGHTS.ControlDiv.clientHeight;
        HCC_LIGHTS.camauto.onWindowResize();
        $("#controls_div")[0].style.width = tw_;
        $("#controls_div")[0].style.height = th_;

        three.main_renderer.setSize(tw_, th_);
        three.onWindowResize(tw_,th_);
    }

    //֡Ƶ
    var enterframe=function(){
        dataMana.update();//���ݹ���
        HCC_LIGHTS.lineMana.update();//������Ч����
        HCC_LIGHTS.camauto.update();//����ͷ��λ
        sky_.update();//��������
        visualizer.update();//����
        star.update();//�ǿ���˸
    }

    three.enterframe=enterframe;
    onWindowResize();
    three.render();
}