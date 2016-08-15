/**
 * Created by Administrator on 2016/7/27.
 */
var HCC_LIGHTS=HCC_LIGHTS||{};
HCC_LIGHTS.DataInterface=function(lineMana_){
    var scope=this;
    this.lineMana=lineMana_;
    var time_=0;
    this.getTopoTime=0;//�ϴλ�ȡtopoͼʱ��
    this.getTopoDelay=10000;//��ȡtopoͼ���ʱ��--------ms

    this.getOnlineTime=0;//�ϴλ�ȡ����ʱ��
    this.getOnlineDelay=10000;//��ȡ��ȡ���߼��ʱ��--------ms

    this.pushLightsIntensity=0;//�ϴ���������ʱ��
    this.pushLightsIntensityDelay=10000;//�������ȼ��ʱ��--------ms

    var testEnabled=false;

    var socket = io('/');
    socket.on('connect', function () {
        /*
        socket.on('nodeChanged', function (msg) {
            console.log('nodeChanged-------------------------------------------------');
            console.log(msg);
            scope.updateTopo();
            scope.onlineUpdate();
        });
        */

        socket.on('topoChanged', function (msg) {
            scope.updateTopo();
        });
        socket.on('onlineChanged', function (msg) {
            scope.onlineUpdate();
        });

        socket.on('lockBrightness', function (msg) {
            scope.lineMana.controlsBrightness(msg.name,(msg.level),true);
        });

        socket.on('openBrightness', function (msg) {
            scope.lineMana.controlsBrightness(msg.name,(msg.level),false);
        });

    });



    /**     * ������������ͼ     */
    this.updateTopo=function(){
        /*         data         */
        this.lineMana.loadTopoData("/api/mesh");
    };

    /**     * �豸����״̬����    */
    this.onlineUpdate=function(){
        /*         data         */
        this.lineMana.requestOnlineData("/api/online");
    };

    this.postData=function(url_,data_){
        $.ajax({
            url:url_,
            data:data_,
            type:'post',
            cache:false,
            dataType:'json',
            error : function() {
                console.log("post error!");
            }
        });
    };
    /**     * ���͵ƹ�ǿ��     */
    this.pushIntensity=function(){

        //ƴ������
        this.getBrightNess();
        //{
            //"devices":[{name:"A1",brightness:"1"},{name:"B1",brightness:"1"}]
            //"group":[{name:"0",brightness:"1"},{name:"1",brightness:"1"}]
        //}


    };
    this.getBrightNess=function(){

        //test
        //return {};

        //var group_=group_||false;
        var group_=HCC_LIGHTS.star.musicRate;

        var ary_=HCC_LIGHTS.star.lampGroups;
        var i_=0;l_=ary_.length;
        var subi_=0,subl_=0,sub_=null;
        
        var data_={};
        var groupObj_=null;
        var lampObj_=null;
        if(group_){
            data_={group:[]};
            for(i_=0;i_<l_;i_++){
                groupObj_=ary_[i_];
                var item_={name:"",brightness:""};
                item_.name=groupObj_.groupId;
                item_.brightness=groupObj_.ary[0].brightness*25;
                data_.group.push(item_);
            }

            this.postData('/api/groupctrl', data_);

        }else{
            data_={devices:[]};

            for(i_=0;i_<l_;i_++){
                sub_=ary_[i_].ary;
                subl_=sub_.length;
                for(subi_=0;subi_<subl_;subi_++){
                    lampObj_=sub_[subi_];
                    if(lampObj_.controlEnabled)continue;
                    var item_={name:" ",brightness:" "};
                    item_.name=lampObj_.starName;
                    item_.brightness=lampObj_.brightness*25;
                    data_.devices.push(item_);
                }
            }

            this.postData('/api/bulbctrl', data_);

        }

        return data_;

    };
    this.update=function(){
        time_=Date.now();
        if(!lineMana_.enabled)return;//�ǿս�����δ׼����
        /*
        if((time_-this.getOnlineTime)>this.getOnlineDelay){//�ﵽ�ӳ�ʱ��
            testEnabled=!testEnabled;
            this.getOnlineTime=time_;
            this.onlineUpdate();//��������״̬
        }

        if((time_-this.getTopoTime)>this.getTopoDelay){//�ﵽ�ӳ�ʱ��
            this.getTopoTime=time_;
            this.updateTopo();//��������ͼ
        }
        */

        if((time_-this.pushLightsIntensity)>this.pushLightsIntensityDelay){//�ﵽ�ӳ�ʱ��
            this.pushLightsIntensity=time_;
            this.pushIntensity();//���͵ƹ�����
        }
    };



    this.updateTopo();
    this.onlineUpdate();

};