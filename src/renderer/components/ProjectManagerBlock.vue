<template>
    <div class="project-manager-block">
        <div class="listdata">
            <div class="text">
                <span class="title">{{ project.title }}</span><br>
                <span class="description">{{ project.description }}</span>
            </div>
            <div class="date">{{ project.updated_at ? new Date(project.updated_at.seconds * 1000).toDateString() : '' }}</div>
        </div>
        <div class="overlay">
            <BigButton cssclass="small" style="width: 100px" @click="openProject">Open</BigButton>
            <BigButton cssclass="small empty" style="width: 100px" @click="presentProject">Present</BigButton>
            <BigButton
                cssclass="small empty"
                style="width: 100px; color: #AE230C; border-color: #AE230C"
                @click="deleteProject"
            >
                Delete
            </BigButton>
        </div>
    </div>
</template>

<script>
import Controller from 'EnvServices/Controller';
import BigButton from '@/components/BigButton';
import AppServer from '@/services/AppServer';
export default {
    name: 'ProjectManagerBlock',
    components: { BigButton },
    props: {
        project: {
            type: Object,
            default: null,
        },
    },
    methods: {
        closePopup() {
            this.$store.commit('closePopup', 'projectmanager');
        },
        openProject() {
            this.closePopup();
            Controller.openProjectFile(this.project.filename);
        },
        presentProject() {
            const galleryData = { id: this.project.filename };
            const url = AppServer.getPublishedUrl(galleryData);
            window.open(url, 'mapgallerywindow');
        },
        deleteProject() {
            if (confirm(`Are you sure that you want to delete ${this.project.title}?`)) {
                AppServer.deleteGallery(this.project)
                    .then(() => Controller.refreshProjects())
                    .catch((err) => {
                        this.$bus.$emit('error', err);
                    });
            }
        },
    },
};
</script>

<style scoped>
div.project-manager-block {
    position: relative;
    height: 80px;
    border-top: 1px solid #DDDDDD;
    border-bottom: 1px solid #DDDDDD;
    margin-bottom: -1px;
}

div.listdata {
    padding: 16px;
}

div.text {
    float: left;
}

span.title {

}

span.description {
    color: #979797;
}

div.date {
    float: right;
    text-align: right;
    color: #979797;
    font-size: 12px;
}

div.overlay {
    display: none;
    background-color: #F6F6F6;
    opacity: 0.8;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    align-items: center;
    justify-content: space-evenly;
}

div.project-manager-block:hover div.overlay{
    display: flex;
}
</style>
