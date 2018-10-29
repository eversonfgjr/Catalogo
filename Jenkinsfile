#!groovy
node {
  def devopsTool = tool 'devops'
  def ci = load "${devopsTool}/common/pipeline/node-pm2.groovy"
  ci.execute()
}