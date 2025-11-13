pipeline {
    agent any

    stages {
        stage('Setup') {
            steps {
                git branch: 'main', url: 'https://github.com/Leehol90/EBAC_MOD_14.git'
                sh '''  npm install
                        cd /serverest_proj
                        nohup npx serverest open &
                '''
                
            }
        }
        stage('Teste'){
            steps{
                sh  ''' export NO_COLOR=1
                        npm run cy:run
                    '''
            }
        }
    }
}