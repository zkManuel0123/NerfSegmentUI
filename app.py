from flask import Flask, render_template, request, jsonify, send_from_directory
import os

app = Flask(__name__)

UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    if file:
        filename = file.filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        return jsonify({'success': True, 'filename': file_path.replace('static/', '')})


@app.route('/process', methods=['POST'])
def process():
    data = request.get_json()
    image_path = 'static/' + data['image_path']
    points = data['points']

    # 调用自动化脚本进行三维重建和物体分割
    output_mesh = run_nerfstudio_and_sam(image_path, points)

    return jsonify({'success': True, 'output_mesh': output_mesh})


def run_nerfstudio_and_sam(image_path, points):
    # 在这里调用SAM和Nerfstudio的相关代码
    # 并返回生成的Mesh文件路径
    output_mesh = "path_to_output_mesh"
    return output_mesh


if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(debug=True)
